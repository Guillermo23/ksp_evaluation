import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { first } from 'rxjs/operators';
import * as XLSX from 'xlsx';

import { UserService } from '../_services';
import { User } from '../_models';

@Component({
    selector: 'list-component',
    templateUrl: './list.component.html',
    styleUrls: ['./empleados.component.scss'],
})

export class ListComponent implements OnInit {
    users!: User[];
    @ViewChild('TABLE') table: ElementRef | undefined;
    displayedColumns = ['position', 'name', 'weight', 'symbol'];

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    exportTOExcel() {
        const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table?.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        
        /* save to file */
        XLSX.writeFile(wb, 'KSP_Empleados.xlsx');
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        if (!user) return;
        user.isDeleting = true;
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.users = this.users.filter(x => x.id !== id));
    }
}