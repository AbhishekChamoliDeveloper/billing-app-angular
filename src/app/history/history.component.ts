import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
  bills: any[] = [];

  printBill(bill: any): void {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="mb-8 border p-4 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-xl font-semibold">Bill No: ${bill.billNo}</h2>
              <span class="text-gray-500">${bill.date}</span>
            </div>

            <div class="mb-4">
              <h3 class="text-lg font-semibold mb-2">Customer Information</h3>
              <p><strong>Name:</strong> ${bill.customer.name}</p>
              <p><strong>Mobile:</strong> ${bill.customer.mobile}</p>
              <p><strong>Contact:</strong> ${bill.customer.contact}</p>
              <p><strong>Address:</strong> ${bill.customer.address}</p>
            </div>

            <div class="mb-4">
              <h3 class="text-lg font-semibold mb-2">Products</h3>
              <ul>
                ${bill.products
                  .map(
                    (product) => `
                  <li>${product.name} - Quantity: ${
                      product.quantity
                    } - Total: $${product.totalPrice.toFixed(2)}</li>
                `
                  )
                  .join('')}
              </ul>
            </div>

            <div class="mb-4">
              <h3 class="text-lg font-semibold mb-2">Payment Information</h3>
              <p><strong>Payment Mode:</strong> ${bill.paymentMode}</p>
              <p><strong>Subtotal:</strong> $${bill.subtotal.toFixed(2)}</p>
              <p><strong>Total:</strong> $${bill.total.toFixed(2)}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  ngOnInit(): void {
    const storedBills = JSON.parse(localStorage.getItem('bills')) || [];

    this.bills = storedBills.sort((a, b) => {
      return b.timeStamp - a.timeStamp;
    });
  }
}
