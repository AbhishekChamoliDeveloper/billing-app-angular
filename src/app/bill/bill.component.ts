import { Component } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
})
export class BillComponent {
  productList: any[] = JSON.parse(localStorage.getItem('productList')) || [];
  customerName = '';
  customerMobile = '';
  customerContact = '';
  customerAddress = '';
  paymentMode = 'cash';
  selectedProduct = '';
  quantity = 1;
  selectedProducts: any[] = [];

  constructor() {
    const initialBills = JSON.parse(localStorage.getItem('bills')) || [];
    localStorage.setItem('bills', JSON.stringify(initialBills));
  }

  saveBill(): void {
    if (_.isEmpty(this.customerName)) {
      alert('Please provide customer name.');
      return;
    }

    if (_.isEmpty(this.customerMobile)) {
      alert('Please provide customer mobile number.');
      return;
    }

    if (this.customerMobile.length < 10 || this.customerMobile.length > 15) {
      alert('Mobile number should be between 10 and 15 characters.');
      return;
    }

    if (_.isEmpty(this.customerAddress)) {
      alert('Please provide customer address.');
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    const uniqueBillNo = this.generateUniqueBillNo();

    const bill = {
      billNo: uniqueBillNo,
      date: formattedDate,
      timeStamp: new Date().getTime(),
      customer: {
        name: this.customerName,
        mobile: this.customerMobile,
        contact: this.customerContact,
        address: this.customerAddress,
      },
      paymentMode: this.paymentMode,
      products: this.selectedProducts,
      subtotal: this.calculateSubtotal(),
      total: this.calculateTotal(),
    };

    console.log('Bill saved!', bill);

    const savedBills = JSON.parse(localStorage.getItem('bills')) || [];
    savedBills.push(bill);
    localStorage.setItem('bills', JSON.stringify(savedBills));

    this.resetForm();
  }

  generateUniqueBillNo(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `BILL${timestamp}${random}`;
  }

  calculateSubtotal(): number {
    return this.selectedProducts.reduce(
      (subtotal, product) => subtotal + product.totalPrice,
      0
    );
  }

  calculateTotal(): number {
    return this.calculateSubtotal();
  }

  addProductToBill(): void {
    if (_.isEmpty(this.selectedProduct)) {
      alert('Please select a product.');
      return;
    }

    const selectedProduct = this.productList.find(
      (product) => product.name === this.selectedProduct
    );

    if (selectedProduct) {
      const existingProduct = this.selectedProducts.find(
        (product) => product.name === selectedProduct.name
      );

      if (existingProduct) {
        existingProduct.quantity += this.quantity;
        existingProduct.totalPrice =
          existingProduct.quantity * Number(existingProduct.sellingPrice);
      } else {
        const newProduct = {
          ...selectedProduct,
          quantity: this.quantity,
          totalPrice: this.quantity * Number(selectedProduct.sellingPrice),
        };
        this.selectedProducts.push(newProduct);
      }
    }
  }

  removeProductFromBill(product: any): void {
    this.selectedProducts = this.selectedProducts.filter((p) => p !== product);
  }

  private resetForm(): void {
    this.customerName = '';
    this.customerMobile = '';
    this.customerContact = '';
    this.customerAddress = '';
    this.paymentMode = 'cash';
    this.selectedProduct = '';
    this.quantity = 1;
    this.selectedProducts = [];
  }
}
