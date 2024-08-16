import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Income } from 'src/app/@core/models/income';
import { ConstantsService } from 'src/app/@core/services/common/constants.service';
import { PrintService } from 'src/app/@core/services/common/print.service';
import { IncomeService } from 'src/app/@core/services/rest/income.service';
import { ReportService } from 'src/app/@core/services/rest/report.service';
import { SelectionOption } from 'src/app/@core/types/selection';
import { SimpleTableColumnType, SimpleTableConfiguration } from 'src/app/@core/types/simple-table-definition';
import { AddIncomeComponent } from '../../components/add-income/add-income.component';
import { SystemParameterService } from 'src/app/@core/services/rest/system-parameter.service';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss']
})
export class IncomeListComponent implements OnInit {

  title: string = 'Ingresos';

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

  activeReportIndex: number = 0;

  currencyRate: number = 0;

  ref: DynamicDialogRef | undefined;

  private _currentDate: Date = new Date();
  private _availableReportFuncs = [
    this.retrieveMonthlyIncomes,
    this.retrieveYearlyIncomes
  ];

  constructor(
    private _incomeService: IncomeService,
    private _constantsService: ConstantsService,
    private _reportService: ReportService,
    private _printService: PrintService,
    private _dialogService: DialogService,
    private _systemParameterService: SystemParameterService
  ) {
    this.selectedMonth = this._currentDate.getMonth() + 1;
    this.selectedYear = this._currentDate.getFullYear();
  }

  ngOnInit(): void {
    this.populateMonthsAndYears();
    this.retrieveCurrencyRate();
    this._availableReportFuncs[this.activeReportIndex].call(this);
  }

  async retrieveCurrencyRate() {
    const currencyRate = await this._systemParameterService.getCurrencyChangeRate();
    this.currencyRate = currencyRate.currency_rate ?? 0;
  }

  async retrieveMonthlyIncomes() {
    this.isProcessing = true;

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

    this.isProcessing = false;
  }

  async printMonthlyIncomes() {
    this.isProcessingReport = true;
    const reportUrl = await this._reportService.getMonthlyIncomesPrintReportUrl(this.selectedMonth, this.selectedYear);

    this._printService.printPdf(reportUrl, () => this.isProcessingReport = false);
  }

  async retrieveYearlyIncomes() {
    this.isProcessing = true;

    this.incomes = [];
    this.total_income = 0;
    this.total_real_income = 0;
    this.lost_income = 0;

    const year = this.selectedYear;

    const yearlyIncome = await this._incomeService.getYearlyIncomes(year);

    this.incomes = yearlyIncome.incomes;
    this.total_income = yearlyIncome.total_income;
    this.total_real_income = yearlyIncome.total_real_income;
    this.lost_income = yearlyIncome.lost_income;

    const yearLabel = this.selectedYear.toString();
    this.title = `Ingresos Anuales: ${yearLabel}`;

    this.isProcessing = false;
  }

  async printYearlyIncomes() {
    this.isProcessingReport = true;
    const reportUrl = await this._reportService.getYearlyIncomesPrintReportUrl(this.selectedYear);

    this._printService.printPdf(reportUrl, () => this.isProcessingReport = false);
  }

  onChangeReportType(activeIndex: any) {
    this._availableReportFuncs[activeIndex].call(this);
  }

  onChangeReporParams() {
    this._availableReportFuncs[this.activeReportIndex].call(this);
  }

  async openAddDiscountModal() {


    this.ref = this._dialogService.open(
      AddIncomeComponent,
      {
        header: 'Registrar Nuevo Ingreso (Otros)',
        width: '50%',
        data: { currencyRate: { value: this.currencyRate } }
      });

    this.ref.onClose.subscribe((result) => {
      this._availableReportFuncs[this.activeReportIndex].call(this);
    });
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
