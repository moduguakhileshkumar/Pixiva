import { showToast } from '../app.js';

export function initInvoiceGenerator() {
  const tableBody = document.querySelector('#invoice-items-table tbody');
  const addRowBtn = document.getElementById('btn-invoice-add-row');
  const printBtn = document.getElementById('btn-print-invoice');
  
  const subtotalVal = document.getElementById('invoice-val-subtotal');
  const taxVal = document.getElementById('invoice-val-tax');
  const totalVal = document.getElementById('invoice-val-total');

  // Listeners
  addRowBtn.addEventListener('click', addInvoiceRow);
  printBtn.addEventListener('click', () => {
    window.print();
    showToast('Invoice PDF preview loaded!');
  });

  // Event delegation on table inputs and deletes
  tableBody.addEventListener('input', (e) => {
    if (e.target.classList.contains('invoice-qty') || e.target.classList.contains('invoice-rate')) {
      calculateInvoiceTotals();
    }
  });

  tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.invoice-row-delete');
    if (btn) {
      const row = btn.closest('tr');
      // Ensure at least one item remains
      if (tableBody.querySelectorAll('tr').length > 1) {
        row.remove();
        calculateInvoiceTotals();
        showToast('Line item deleted.');
      } else {
        showToast('Invoice must have at least one item!', true);
      }
    }
  });

  // Initial calculation
  calculateInvoiceTotals();

  function addInvoiceRow() {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><input type="text" class="invoice-item-desc" placeholder="New Service / Product Description"></td>
      <td><input type="number" class="invoice-item-num invoice-qty" value="1" placeholder="Quantity"></td>
      <td><input type="number" class="invoice-item-num invoice-rate" value="100" placeholder="Price"></td>
      <td class="invoice-item-total">$100.00</td>
      <td><button class="invoice-row-delete" title="Delete Row"><i class="fa-solid fa-trash-can"></i></button></td>
    `;
    tableBody.appendChild(newRow);
    calculateInvoiceTotals();
    showToast('Line item added.');
  }

  function calculateInvoiceTotals() {
    const rows = tableBody.querySelectorAll('tr');
    let subtotal = 0;

    rows.forEach(row => {
      const qtyInput = row.querySelector('.invoice-qty');
      const rateInput = row.querySelector('.invoice-rate');
      const totalCol = row.querySelector('.invoice-item-total');

      const qty = parseFloat(qtyInput.value) || 0;
      const rate = parseFloat(rateInput.value) || 0;
      const rowTotal = qty * rate;

      totalCol.textContent = `$${rowTotal.toFixed(2)}`;
      subtotal += rowTotal;
    });

    const tax = subtotal * 0.08; // 8% sales tax
    const total = subtotal + tax;

    subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    taxVal.textContent = `$${tax.toFixed(2)}`;
    totalVal.textContent = `$${total.toFixed(2)}`;
  }
}
