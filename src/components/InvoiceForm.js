import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: 'Ksh',
      currentDate: '',
      invoiceNumber: 1,
      transactionCode: '',
      dateOfIssue: '',
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billFrom: '',
      billFromEmail: '',
      billFromAddress: '',
      notes: '',
      total: '0.00',
      subTotal: '0.00',
      taxRate: '',
      taxAmmount: '0.00',
      discountRate: '',
      discountAmmount: '0.00',
      items: [
        {
          id: '0', // Changed to string for consistency
          name: '',
          description: '',
          price: '1.00',
          quantity: 1
        }
      ]
    };
    this.editField = this.editField.bind(this);
  }

  componentDidMount() {
    this.handleCalculateTotal();
  }

  handleRowDel(itemToRemove) {
    const updatedItems = this.state.items.filter(item => item.id !== itemToRemove.id);
    this.setState({ items: updatedItems }, this.handleCalculateTotal);
  }

  handleAddEvent() {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1
    };
    const updatedItems = [...this.state.items, newItem];
    this.setState({ items: updatedItems }, this.handleCalculateTotal);
  }

  handleCalculateTotal() {
    const subTotal = this.state.items.reduce((acc, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 0;
      return acc + itemPrice * itemQuantity;
    }, 0);

    const roundedSubTotal = parseFloat(subTotal.toFixed(2));
    const taxRate = parseFloat(this.state.taxRate) || 0;
    const discountRate = parseFloat(this.state.discountRate) || 0;

    const taxAmount = parseFloat((roundedSubTotal * (taxRate / 100)).toFixed(2));
    const discountAmount = parseFloat((roundedSubTotal * (discountRate / 100)).toFixed(2));

    const total = parseFloat((roundedSubTotal - discountAmount + taxAmount).toFixed(2));

    this.setState({
      subTotal: roundedSubTotal.toFixed(2),
      taxAmmount: taxAmount.toFixed(2),
      discountAmmount: discountAmount.toFixed(2),
      total: total.toFixed(2)
    });
  }

  onItemizedItemEdit(evt) {
    const { id, name, value } = evt.target;
    // Convert both to strings for consistent comparison
    const updatedItems = this.state.items.map(item =>
      String(item.id) === String(id) ? { ...item, [name]: value } : item
    );
    this.setState({ items: updatedItems }, this.handleCalculateTotal);
  }

  editField(event) {
    this.setState({
      [event.target.name]: event.target.value
    }, this.handleCalculateTotal);
  }

  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };

  openModal = (event) => {
    event.preventDefault();
    this.handleCalculateTotal();
    this.setState({ isOpen: true });
  };

  closeModal = () => this.setState({ isOpen: false });

  render() {
    return (
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              {/* Header */}
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current Date:&nbsp;</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold me-2">Due Date:</span>
                    <Form.Control type="date" value={this.state.dateOfIssue} name="dateOfIssue" onChange={this.editField} style={{ maxWidth: '150px' }} required />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2">Invoice Number:&nbsp;</span>
                  <Form.Control type="number" value={this.state.invoiceNumber} name="invoiceNumber" onChange={this.editField} min="1" style={{ maxWidth: '70px' }} required />
                </div>
              </div>

              {/* Transaction Code */}
              <div className="d-flex flex-row align-items-center mt-2">
                <span className="fw-bold me-2">Transaction Code:&nbsp;</span>
                <Form.Control type="text" name="transactionCode" value={this.state.transactionCode} onChange={this.editField} placeholder="e.g., BANKCODE123456" style={{ maxWidth: '200px' }} required />
              </div>

              <hr className="my-4" />

              {/* Billing Info */}
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control placeholder="Who is this invoice to?" value={this.state.billTo} type="text" name="billTo" className="my-2" onChange={this.editField} required />
                  <Form.Control placeholder="Email address" value={this.state.billToEmail} type="email" name="billToEmail" className="my-2" onChange={this.editField} required />
                  <Form.Control placeholder="Billing address" value={this.state.billToAddress} type="text" name="billToAddress" className="my-2" onChange={this.editField} required />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Bill from:</Form.Label>
                  <Form.Control placeholder="Who is this invoice from?" value={this.state.billFrom} type="text" name="billFrom" className="my-2" onChange={this.editField} required />
                  <Form.Control placeholder="Email address" value={this.state.billFromEmail} type="email" name="billFromEmail" className="my-2" onChange={this.editField} required />
                  <Form.Control placeholder="Billing address" value={this.state.billFromAddress} type="text" name="billFromAddress" className="my-2" onChange={this.editField} required />
                </Col>
              </Row>

              {/* Invoice Items */}
              <InvoiceItem
                onItemizedItemEdit={this.onItemizedItemEdit.bind(this)}
                onRowAdd={this.handleAddEvent.bind(this)}
                onRowDel={this.handleRowDel.bind(this)}
                currency={this.state.currency}
                items={this.state.items}
              />

              {/* Totals */}
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex flex-row justify-content-between">
                    <span className="fw-bold">Subtotal:</span>
                    <span>{this.state.currency}{this.state.subTotal}</span>
                  </div>
                  <div className="d-flex flex-row justify-content-between mt-2">
                    <span className="fw-bold">Discount:</span>
                    <span>({this.state.discountRate || 0}%) {this.state.currency}{this.state.discountAmmount}</span>
                  </div>
                  <div className="d-flex flex-row justify-content-between mt-2">
                    <span className="fw-bold">Tax:</span>
                    <span>({this.state.taxRate || 0}%) {this.state.currency}{this.state.taxAmmount}</span>
                  </div>
                  <hr />
                  <div className="d-flex flex-row justify-content-between fw-bold" style={{ fontSize: '1.125rem' }}>
                    <span>Total:</span>
                    <span>{this.state.currency}{this.state.total}</span>
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              {/* Notes */}
              <Form.Label className="fw-bold">Payment Method:</Form.Label>
              <Form.Control placeholder="Payment Method" name="notes" value={this.state.notes} onChange={this.editField} as="textarea" className="my-2" rows={1} />
            </Card>
          </Col>

          {/* Sidebar */}
          <Col md={4} lg={3}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <Button variant="primary" type="submit" className="d-block w-100">Review Invoice</Button>
              <InvoiceModal showModal={this.state.isOpen} closeModal={this.closeModal} info={this.state} items={this.state.items} currency={this.state.currency} subTotal={this.state.subTotal} taxAmmount={this.state.taxAmmount} discountAmmount={this.state.discountAmmount} total={this.state.total} />
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select onChange={event => this.onCurrencyChange({ currency: event.target.value })} value={this.state.currency}>
                  <option value="Ksh">KES (Kenyan Shilling)</option>
                  <option value="TSh">TZS (Tanzanian Shilling)</option>
                  <option value="USh">UGX (Ugandan Shilling)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Tax rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control name="taxRate" type="number" value={this.state.taxRate} onChange={this.editField} placeholder="0.0" min="0" max="100" step="0.01" />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Discount rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control name="discountRate" type="number" value={this.state.discountRate} onChange={this.editField} placeholder="0.0" min="0" max="100" step="0.01" />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default InvoiceForm;