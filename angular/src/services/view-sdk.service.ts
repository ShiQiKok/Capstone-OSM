import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ViewSDKClient {
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

    ready() {
        return this.readyPromise;
    }

    previewFile(divId: string, url: any, viewerConfig: any) {
        const config: any = {
            /* Pass your registered client id */
            clientId: '4dfd11a208224ebab91da699567e8c35',
        };
        if (divId) {
            /* Optional only for Light Box embed mode */
            /* Pass the div id in which PDF should be rendered */
            config.divId = divId;
        }
        /* Initialize the AdobeDC View object */
        this.adobeDCView = new window.AdobeDC.View(config);

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
                    fileName: 'Bodea Brochure.pdf',
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

    registerSaveApiHandler() {
        /* Define Save API Handler */
        const saveApiHandler = (metaData: any, content: any, options: any) => {
            console.log(metaData, content, options);
            return new Promise((resolve) => {
                /* Dummy implementation of Save API, replace with your business logic */
                setTimeout(() => {
                    const response = {
                        code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                        data: {
                            metaData: Object.assign(metaData, {
                                updatedAt: new Date().getTime(),
                            }),
                        },
                    };
                    resolve(response);
                }, 2000);
            });
        };

        this.adobeDCView.registerCallback(
            window.AdobeDC.View.Enum.CallbackType.SAVE_API,
            saveApiHandler,
            {}
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
