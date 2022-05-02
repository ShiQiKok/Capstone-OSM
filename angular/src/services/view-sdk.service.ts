import { Injectable } from '@angular/core';
import { AnswerScriptService } from './answer-script.service';

const saveConfig = {
    autoSaveFrequency: 1, // must greater than 0 to trigger
    enableFocusPolling: true,
    showSaveButton: false,
};

@Injectable({
    providedIn: 'root',
})
export class ViewSDKClient {
    constructor(public _answerScriptService: AnswerScriptService) {
        this._answerScriptService.getApi();
    }

    readyPromise: Promise<any> = new Promise((resolve) => {
        if (window.AdobeDC) {
            resolve('success');
        } else {
            /* Wait for Adobe Document Services PDF Embed API to be ready */
            document.addEventListener('adobe_dc_view_sdk.ready', () => {
                resolve('success');
            });
        }
    });

    adobeDCView: any;
    azureURL?: string;

    ready() {
        return this.readyPromise;
    }

    previewFile(divId: string, url: any, viewerConfig: any, answerScriptId: number) {
        const config: any = {
            /* Pass your registered client id */
            clientId: '4dfd11a208224ebab91da699567e8c35',
        };

        this.azureURL = url;

        if (divId) {
            /* Optional only for Light Box embed mode */
            /* Pass the div id in which PDF should be rendered */
            config.divId = divId;
        }
        /* Initialize the AdobeDC View object */
        this.adobeDCView = new window.AdobeDC.View(config);

        this.registerSaveApiHandler(answerScriptId);

        /* Invoke the file preview API on Adobe DC View object */
        const previewFilePromise = this.adobeDCView.previewFile(
            {
                /* Pass information on how to access the file */
                content: {
                    /* Location of file where it is hosted */
                    location: {
                        url: url,
                    },
                },
                /* Pass meta data of file */
                metaData: {
                    /* file name */
                    fileName: this.azureURL!.split('/').slice(-1)[0],
                    /* file ID */
                    id: '6d07d124-ac85-43b3-a867-36930f502ac6',
                },
            },
            viewerConfig
        );

        return previewFilePromise;
    }

    previewFileUsingFilePromise(
        divId: string,
        filePromise: Promise<string | ArrayBuffer>,
        fileName: any
    ) {
        /* Initialize the AdobeDC View object */
        this.adobeDCView = new window.AdobeDC.View({
            /* Pass your registered client id */
            clientId: '4dfd11a208224ebab91da699567e8c35',
            /* Pass the div id in which PDF should be rendered */
            divId,
        });

        /* Invoke the file preview API on Adobe DC View object */
        this.adobeDCView.previewFile(
            {
                /* Pass information on how to access the file */
                content: {
                    /* pass file promise which resolve to arrayBuffer */
                    promise: filePromise,
                },
                /* Pass meta data of file */
                metaData: {
                    /* file name */
                    fileName,
                },
            },
            {}
        );
    }

    registerSaveApiHandler(id: number) {
        /* Define Save API Handler */
        const saveApiHandler = (metaData: any, content: any, options: any) => {
            return new Promise((resolve) => {
                /* Dummy implementation of Save API, replace with your business logic */
                // this._answerScriptService.create()
                let uint8Array = new Uint8Array(content);
                let blob = new Blob([uint8Array], { type: 'application/pdf' });
                let formData = new FormData();
                let pdfFileName = metaData.fileName;
                let updatedName =
                    pdfFileName.split('.')[0] + '-' + 'updated' + '.pdf';
                formData.append('file', blob, updatedName);

                this._answerScriptService.update(id, formData)
                .then((obj) => {
                    const response = {
                        code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                        data: {
                            metaData: Object.assign(metaData, {
                                updatedAt: new Date().getTime(),
                            }),
                        },
                    };
                    resolve(response);
                });
            });
        };

        this.adobeDCView.registerCallback(
            window.AdobeDC.View.Enum.CallbackType.SAVE_API,
            saveApiHandler,
            saveConfig
        );
    }

    registerEventsHandler() {
        /* Register the callback to receive the events */
        this.adobeDCView.registerCallback(
            /* Type of call back */
            window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
            /* call back function */
            (event: any) => {
                console.log(event);
            },
            /* options to control the callback execution */
            {
                /* Enable PDF analytics events on user interaction. */
                enablePDFAnalytics: true,
            }
        );
    }
}
