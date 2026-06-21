// country-selection-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-country-selection-modal',
  templateUrl: './country-selection-modal.component.html',
  styleUrls: ['./country-selection-modal.component.scss'],
})
export class CountrySelectionModalComponent implements OnInit {
  searchControl = new FormControl();
  allCountries: any[] = [];
  filteredCountries: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CountrySelectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.allCountries = data.countries;
    this.filteredCountries = [...this.allCountries];
  }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.filterCountries(searchTerm);
    });
  }

  filterCountries(searchTerm: string) {
    if (!searchTerm) {
      this.filteredCountries = [...this.allCountries];
      return;
    }

    const filterValue = searchTerm.toLowerCase();
    
    // First, try to filter in the current language
    let filtered = this.allCountries.filter((country) =>
      country.countryName.toLowerCase().includes(filterValue),
    );
    
    // If no results found and we have the opposite language data, search there
    if (filtered.length === 0 && this.data.oppositeCountries && this.data.oppositeCountries.length > 0) {
      // Search in opposite language array
      const oppositeFiltered = this.data.oppositeCountries.filter((country: any) =>
        country.countryName.toLowerCase().includes(filterValue)
      );
      
      // Map back to current language using pseudoCountryCode and phoneCode
      if (oppositeFiltered.length > 0) {
        filtered = oppositeFiltered.map((oppositeCountry: any) => {
          // Find matching country in current language by pseudoCountryCode or phoneCode
          return this.allCountries.find((currentCountry) =>
            currentCountry.pseudoCountryCode === oppositeCountry.pseudoCountryCode ||
            (currentCountry.phoneCode === oppositeCountry.phoneCode && oppositeCountry.phoneCode)
          );
        }).filter((country: any): country is any => country !== undefined); // Remove any undefined results
      }
    }
    
    this.filteredCountries = filtered;
  }

  selectCountry(country: any) {
    this.dialogRef.close(country);
  }
}
