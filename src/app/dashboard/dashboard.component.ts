import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  productList: any[] = [];
  bills: any[] = [];
  reportData: any = {};

  ngOnInit() {
    this.productList = JSON.parse(localStorage.getItem('productList')) || [];
    this.bills = JSON.parse(localStorage.getItem('bills')) || [];

    this.generateReport();
  }

  generateReport() {
    this.reportData.totalSales = this.bills.reduce(
      (total, bill) => total + bill.total,
      0
    );
    this.reportData.totalItemsSold = this.bills.reduce(
      (total, bill) =>
        total +
        bill.products.reduce(
          (itemTotal, product) => itemTotal + product.quantity,
          0
        ),
      0
    );

    // Calculate profit and loss
    this.reportData.profit = this.bills.reduce(
      (total, bill) =>
        total +
        (bill.total -
          bill.products.reduce(
            (itemTotal, product) =>
              itemTotal +
              (product.sellingPrice - product.originalPrice) * product.quantity,
            0
          )),
      0
    );
    this.reportData.loss = this.bills.reduce(
      (total, bill) =>
        total +
        bill.products.reduce(
          (itemTotal, product) =>
            itemTotal +
            (product.originalPrice - product.sellingPrice) * product.quantity,
          0
        ),
      0
    );

    // Calculate average selling price
    const totalSellingPrice = this.bills.reduce(
      (total, bill) =>
        total +
        bill.products.reduce(
          (itemTotal, product) =>
            itemTotal + product.sellingPrice * product.quantity,
          0
        ),
      0
    );
    const totalItemsSold = this.reportData.totalItemsSold;
    this.reportData.avgSellingPrice = totalSellingPrice / totalItemsSold;

    // Determine top-selling product
    const productQuantities = {};
    this.bills.forEach((bill) => {
      bill.products.forEach((product) => {
        if (product.name in productQuantities) {
          productQuantities[product.name] += product.quantity;
        } else {
          productQuantities[product.name] = product.quantity;
        }
      });
    });
    const topSellingProduct = Object.keys(productQuantities).reduce((a, b) =>
      productQuantities[a] > productQuantities[b] ? a : b
    );
    this.reportData.topSellingProduct = topSellingProduct;

    // Calculate total customers
    const uniqueCustomers = new Set(
      this.bills.map((bill) => bill.customer.name)
    );
    this.reportData.totalCustomers = uniqueCustomers.size;

    // Log the report data to the console for testing
    console.log(this.reportData);
  }
}
