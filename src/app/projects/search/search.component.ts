import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    searchInput: FormControl = new FormControl();    
    @Output() search = new EventEmitter<string>();
  
    constructor() {}
  
    ngOnInit(): void {
      this.searchInput.valueChanges
        .pipe(
          debounceTime(200),
          distinctUntilChanged()
        )
        .subscribe(text => {
          this.search.emit(text);
        });
    }

}
