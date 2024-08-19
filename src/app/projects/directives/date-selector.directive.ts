import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDateSelector]'
})
export class DateSelectorDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener("blur", ["$event"]) onBlur() {
    if(!this.ngControl.control.value){
      this.ngControl.control.setValue(new Date());
    }else{
      let now = new Date();
      const currentSetDate = new Date(this.ngControl.control.value);
      const day = currentSetDate.getDate();
      const month = currentSetDate.getMonth();
      const year = currentSetDate.getFullYear();
      const dayHasDefaultMonthYear = day !== 1 && month === 0 && year === 2001;
      const monthHasDefaultDayYear = day === 1 && month !== 0 && year === 2001;
      const yearHasDefaultMonthYear = day === 1 && month === 0 && year !== 2001;
      const dayAndMonthHasDefaultYear = day !== 1 && month !== 0 && year === 2001;

      //Set Day/Month/Year if one has valid value (the rest of the date is set to today)
      if(dayHasDefaultMonthYear){
        now.setDate(day);
      }

      if(monthHasDefaultDayYear){
        now.setMonth(month);
      }

      if(yearHasDefaultMonthYear){
        now.setFullYear(year);
      }

      if(dayAndMonthHasDefaultYear){
        now.setDate(day);
        now.setMonth(month);
      }

      if(!dayHasDefaultMonthYear && 
        !monthHasDefaultDayYear && 
        !yearHasDefaultMonthYear && 
        !dayAndMonthHasDefaultYear){
        now = new Date(year, month, day);
      }  

      this.ngControl.control.setValue(now);
    }    
  }
}
