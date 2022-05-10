import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GradebookService {
    constructor(public http: HttpClient) {}

    downloadGradebook(assessmentId: number, filename: string) {
        return new Promise<any>((resolve, reject) => {
            this.http
                .get(`api/gradebook/download/${assessmentId}`, {
                    responseType: 'blob',
                })
                .subscribe((response: any) =>{
                    let dataType = response.type;
                    let binaryData = [];
                    binaryData.push(response);
                    let downloadLink = document.createElement('a');
                    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
                    if (filename)
                        downloadLink.setAttribute('download', filename);
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                });
        });
    }
}
