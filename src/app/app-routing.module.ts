import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockComponent } from './stock/stock.component';
import { BillComponent } from './bill/bill.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'stock', component: StockComponent },
  { path: 'bill', component: BillComponent },
  { path: 'history', component: HistoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
