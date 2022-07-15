// import { Injectable } from '@angular/core';
// import { ToastComponent, ToastCloseArgs, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
// import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
// @Injectable({
//   providedIn: 'root'
// })
// export class ToastService {
//   private toastObj?: ToastComponent;
//   private btninfo?: ButtonComponent;
//   private btnwarn?: ButtonComponent;
//   private btnerr?: ButtonComponent;
//   private btnsuccess?: ButtonComponent;
//   private hidebtn?: ButtonComponent;
//   public position?: ToastPositionModel = { X: 'Right' };
//   public toasts: { [key: string]: Object }[] = [
//     { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
//     { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
//     { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
//     { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
// ];

//   constructor() { }
//   public onCreate(ToastObj:any): void {
//     setTimeout(function () {
//       ToastObj.show(this.toasts[3]);
//     }.bind(this), 200);
// }

// public infoClick(toastObj): void {
//     this.toastObj.show(this.toasts[3]);
// }

// public warningClick(toastObj): void {
//     this.toastObj.show(this.toasts[0]);
// }

// public successClick(toastObj): void {
//     this.toastObj.show(this.toasts[1]);
// }

// public errorClick(toastObj): void {
//     this.toastObj.show(this.toasts[2]);
// }

// public hideClick(toastObj): void {
//     this.toastObj.hide('All');
// }

// public onclose(e: ToastCloseArgs): void {
//     if (e.toastContainer.childElementCount === 0) {
//         this.hidebtn.element.style.display = 'none';
//     }
// }

// public onBeforeOpen(): void {
//     this.hidebtn.element.style.display = 'inline-block';
// }

// }
