import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
})
export class StockComponent implements OnInit {
  productList: any[] = [];
  searchText: string = '';
  showAddProductModal: boolean = false;
  newProduct: any = {
    name: '',
    category: '',
    sellingPrice: 0,
    originalPrice: 0,
    image: '',
  };

  editingProductIndex: number | null = null;

  ngOnInit() {
    this.loadProductList();
  }

  private loadProductList() {
    const storedProductList = localStorage.getItem('productList');
    this.productList = storedProductList ? JSON.parse(storedProductList) : [];
  }

  private saveProductList() {
    localStorage.setItem('productList', JSON.stringify(this.productList));
  }

  get filteredProductList() {
    return this.productList.filter((product) =>
      this.searchInProduct(product, this.searchText.toLowerCase())
    );
  }

  private searchInProduct(product: any, searchText: string): boolean {
    return Object.values(product).some((value) =>
      value.toString().toLowerCase().includes(searchText)
    );
  }

  openAddProductModal() {
    this.showAddProductModal = true;
  }

  closeAddProductModal() {
    this.showAddProductModal = false;
    this.editingProductIndex = null;
    this.newProduct = {
      name: '',
      category: '',
      sellingPrice: 0,
      originalPrice: 0,
      image: '',
    };
  }

  openEditProductModal(index: number) {
    this.editingProductIndex = index;
    this.newProduct = { ...this.productList[index] };
    this.openAddProductModal();
  }

  deleteProduct(index: number) {
    const productName = this.productList[index].name;
    const isConfirmed = confirm(
      `Are you sure you want to delete ${productName}?`
    );

    if (isConfirmed) {
      this.productList.splice(index, 1);
      this.saveProductList(); // Save updated list to localStorage
      alert(`${productName} deleted successfully!`);
    } else {
      alert(`Deletion of ${productName} cancelled.`);
    }
  }

  addProduct() {
    if (this.validateProduct()) {
      if (this.editingProductIndex !== null) {
        // Update existing product
        this.productList[this.editingProductIndex] = { ...this.newProduct };
        alert(`${this.newProduct.name} updated successfully!`);
      } else {
        // Add new product
        this.productList.push({ ...this.newProduct });
        alert(`${this.newProduct.name} added successfully!`);
      }
      this.saveProductList(); // Save updated list to localStorage
      this.closeAddProductModal();
    }
  }

  private validateProduct(): boolean {
    if (
      this.newProduct.name.trim() &&
      this.newProduct.category.trim() &&
      this.newProduct.sellingPrice >= 0 &&
      this.newProduct.originalPrice >= 0
    ) {
      return true;
    } else {
      alert(
        'Please fill in all required fields, and ensure prices are non-negative.'
      );
      return false;
    }
  }
}
