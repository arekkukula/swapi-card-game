import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { materialImports } from './material.imports';

@NgModule({
  declarations: [
  ],
  imports: [
    ...materialImports,
    CommonModule,
  ],
  exports: [
    ...materialImports,
    FormsModule,
    BrowserAnimationsModule,
  ],
})
export class SharedModule { }
