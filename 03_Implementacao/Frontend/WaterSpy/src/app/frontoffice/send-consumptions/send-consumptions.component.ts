import { TranslateService } from '@ngx-translate/core';
import { MeterService } from 'src/app/shared/services/api-consumer/meter.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Contract } from 'src/app/shared/models/contract';
import { Meter } from 'src/app/shared/models/meter';
import { ConsumptionService } from 'src/app/shared/services/api-consumer/consumptions.service';
import { ContractService } from 'src/app/shared/services/api-consumer/contract.service';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { AfterViewInit } from "@angular/core";
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-send-consumptions',
  templateUrl: './send-consumptions.component.html',
  styleUrls: ['./send-consumptions.component.scss']
})
export class SendConsumptionsComponent implements OnInit {
  public meters: Array<Meter>;
  public meterSelected: number;
  public contracts: Array<Contract>;
  public contractSelected: Contract;
  public uploadedFile: File;
  public consumptionRead: string;
  public filePath: string;
  public isMobile: boolean;
  public alerts: Array<string>;
  public xRect: number;
  public yRect: number;
  public wRect: number;
  public hRect: number;

  @ViewChild("video")
  public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;
  public cameraStream :any;

  public captures: string[] = [];
  public error: any;
  public isCaptured: boolean = false;
  public isToTakePhoto: boolean = false;

  constructor(
    private contractService: ContractService,
    private consumptionService: ConsumptionService,
    private meterService: MeterService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.contractService.getDetailsByUser().subscribe(res => {
      this.contracts = res;
    });
    this.isMobile = UtilsService.isMobile();
    
  }

  public sendConsumptions() {
    if (this.meterSelected && this.consumptionRead) {
      const consumption = {
        meterId: this.meterSelected,
        value: parseInt(this.consumptionRead)
      };

      this.consumptionService.send(consumption).subscribe((res) => {
        if (res) {
          this.toastr.success("Consumo enviado com sucesso");
        }
      });
    }
  }

  public changeContract(event: any) {
    if (event.id) {
      let contractId = event.id;
      this.meterService.getByContract(contractId).subscribe(res => {
        this.meters = res;
      });
    }
  }

  fileChange(event: any) {
    this.uploadedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = reader.result as string;
    }
    reader.readAsDataURL(this.uploadedFile);
  }

  uploadFile() {
    this.alerts = [];
    let formData = new FormData();
    if (this.uploadedFile) {
      formData.append('image', this.uploadedFile, this.uploadedFile.name);
      formData.append('xRect', "0");
      formData.append('yRect', "0");
      formData.append('wRect', "0");
      formData.append('hRect', "0");
      this.consumptionService.read(formData)
      .subscribe((response) => {
          this.consumptionRead = response.consumption;
      },
      error => {
        
        if (error.error && error.error.code) {
          this.alerts.push(this.translate.instant('ERROR_CODES.' + error.error.code));
        }
      });
    }
  }

  uploadImage() {
    
    if(this.captures){
        var blob = this.dataURItoBlob2(this.captures[this.captures.length-1]);
        var imageFile = new File([blob], "fileName.jpeg", {
          type: "'image/jpeg'"
        });
        this.alerts = [];
        let formData = new FormData();
        if( imageFile ){
            formData.append('image', imageFile, imageFile.name);
            formData.append('xRect', this.xRect.toString());
            formData.append('yRect', this.yRect.toString());
            formData.append('wRect', this.wRect.toString());
            formData.append('hRect', this.hRect.toString());
            
            this.consumptionService.read(formData)
            .subscribe((response) => {
                this.consumptionRead = response.consumption;
            },
            error => {
              
              if (error.error && error.error.code) {
                this.alerts.push(this.translate.instant('ERROR_CODES.' + error.error.code));
              }
            });
        }
    }    
  }
  dataURItoBlob2 (dataURI:string):Blob {

    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

  dataURItoBlob(dataURI: string):Blob {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
 }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.contractNumber.toString().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

  /***** Code of Camera capturing ******/

  async activeCamera(){
    this.drawBoundingBox();
    this.setupDevices();
    this.isToTakePhoto = true;
  }


  turnOffCamera(){
    this.isToTakePhoto = false;
    this.pause();
  }
 
  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.cameraStream = await navigator.mediaDevices.getUserMedia({
          //video: true
          video: {
            width: { min: 1024, ideal: 1280, max: 1280 },
            height: { min: 576, ideal: 720, max: 1080 },
            facingMode: { exact: "environment" }
          }
        });
        if (this.cameraStream && this.video.nativeElement) {
          this.video.nativeElement.srcObject = this.cameraStream;
          this.video.nativeElement.play();
          if( !this.isCaptured ){
            this.video.nativeElement.onplay = function() {
              setTimeout(() => {this.drawBoundingBox} , 300);
            };
          }
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
     
    }
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    this.pause();
    this.isCaptured = true;
    this.uploadImage();
  }
  
  pause(){
    this.video.nativeElement.pause();
    this.cameraStream.getVideoTracks()[0].stop();
  }
  
  async removeCurrent() {
    await this.setupDevices();
    this.isCaptured = false;
  }
  
  drawBoundingBox(){
    var video = this.video.nativeElement;
    var canvas = this.canvas.nativeElement; 
    var ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var faceAreaWidth = canvas.width - (canvas.width/3);
    var faceAreaHeight = canvas.height/5;
    var pX=canvas.width/2 - faceAreaWidth/2;
    var pY=canvas.height/2 - faceAreaHeight/2;
    this.xRect = pX;
    this.yRect = pY;
    this.wRect = faceAreaWidth;
    this.hRect = faceAreaHeight;
    
    ctx.beginPath();
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);    
    ctx.fillStyle = "#555555EE";
    ctx.rect(0,0,canvas.width, canvas.height);
    // top
    ctx.fillRect(this.xRect,0,this.wRect, this.yRect);
    // bottom
    ctx.fillRect(this.xRect,this.yRect+this.hRect,this.wRect, this.yRect);
    // left
    ctx.fillRect(0,0,this.xRect, canvas.height);
    // right
    ctx.fillRect(this.xRect+ this.wRect,0,this.xRect, canvas.height);
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(pX,pY,faceAreaWidth,faceAreaHeight);
    ctx.lineWidth = "3";
    ctx.strokeStyle = "blue";    
    ctx.strokeRect(pX,pY,faceAreaWidth,faceAreaHeight);
    ctx.closePath();
    
    setTimeout(  () => {this.drawBoundingBox()} , 100);
  }

  drawImageToCanvas(image: any) {
    var canvas = this.canvas.nativeElement.getContext("2d");
    canvas.drawImage(image, this.xRect, this.yRect, this.wRect,this.hRect, 0, 0, 1280, 720);
  }

}
