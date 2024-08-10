import { Component, OnInit } from '@angular/core';
import { Income } from 'src/app/@core/models/income';
import { ConstantsService } from 'src/app/@core/services/common/constants.service';
import { PrintService } from 'src/app/@core/services/common/print.service';
import { IncomeService } from 'src/app/@core/services/rest/income.service';
import { ReportService } from 'src/app/@core/services/rest/report.service';
import { SelectionOption } from 'src/app/@core/types/selection';
import { SimpleTableColumnType, SimpleTableConfiguration } from 'src/app/@core/types/simple-table-definition';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss']
})
export class IncomeListComponent implements OnInit {

  title: string = 'Ingresos Mensuales';

  tableConfig: SimpleTableConfiguration = {
    identifierPropRef: 'id',
    columns: [
      {
        propertyRef: 'date',
        title: 'Fecha',
        type: SimpleTableColumnType.DATE
      },
      {
        propertyRef: 'receipt_number',
        title: 'Recibo',
        type: SimpleTableColumnType.TEXT
      },
      {
        propertyRef: 'concept',
        title: 'Concepto',
        type: SimpleTableColumnType.TEXT
      },
      {
        propertyRef: 'amount',
        title: 'Monto',
        type: SimpleTableColumnType.TEXT
      },
      {
        propertyRef: 'sub_total',
        title: 'Total',
        type: SimpleTableColumnType.TEXT
      }
    ],
    actions: [

    ]
  };

  selectedMonth: number;
  selectedYear: number;

  availableMonths: Array<SelectionOption<number>> = [];
  availableYears: Array<SelectionOption<number>> = [];

  incomes: Array<Income> = [];
  total_income: number = 0;
  total_real_income: number = 0;
  lost_income: number = 0;

  isProcessing: boolean = false;
  isProcessingReport: boolean = false;

  private _currentDate: Date = new Date();

  constructor(
    private _incomeService: IncomeService,
    private _constantsService: ConstantsService,
    private _reportService: ReportService,
    private _printService: PrintService
  ) {
    this.selectedMonth = this._currentDate.getMonth() + 1;
    this.selectedYear = this._currentDate.getFullYear();
  }

  ngOnInit(): void {
    this.populateMonthsAndYears();
    this.retrieveMonthlyIncomes();
  }

  async retrieveMonthlyIncomes() {
    this.incomes = [];
    this.total_income = 0;
    this.total_real_income = 0;
    this.lost_income = 0;

    const month = this.selectedMonth;
    const year = this.selectedYear;

    const monthlyIncome = await this._incomeService.getMonthlyIncomes(month, year);

    this.incomes = monthlyIncome.incomes;
    this.total_income = monthlyIncome.total_income;
    this.total_real_income = monthlyIncome.total_real_income;
    this.lost_income = monthlyIncome.lost_income;

    const monthLabel = this.availableMonths[this.selectedMonth - 1].name;
    const yearLabel = this.selectedYear.toString();
    this.title = `Ingresos Mensuales: Mes ${monthLabel} de ${yearLabel}`;
  }

  async printMonthlyIncomes() {
    this.isProcessingReport = true;
    const reportUrl = await this._reportService.getMonthlyIncomesPrintReportUrl(this.selectedMonth, this.selectedYear);

    this._printService.printPdf(reportUrl, () => this.isProcessingReport = false);
  }

  private populateMonthsAndYears() {
    this.availableMonths = this._constantsService.monthNames.map((monthName, index) => ({
      name: monthName,
      value: index + 1
    }));
    const currentYear = this._currentDate.getFullYear();
    this.availableYears = Array.from({ length: 31 }, (_, index) => {
      const year = currentYear - index;
      const selectionOption: SelectionOption<number> = {
        name: year.toString(),
        value: year
      };

      return selectionOption;
    });
  }
}
