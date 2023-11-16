import React from "react";
import { Button, Modal } from "react-bootstrap";
export class CloseSection extends React.Component {
  render() {
    let { title, button1, button2, show, container, close } = this.props;
    return (
      <React.Fragment>
        <Modal
          className="close-modal"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show && show}
          onHide={() => {
            button2();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title className="w-100">{title} </Modal.Title>
          </Modal.Header>

          <Modal.Footer className="mt-5 pt-5 justify-content-center">
            <div className="footer-modal">
              <Button
                className="btn-success btn btn-primary btn-lg"
                onClick={() => {
                  button1();
                  button2();
                }}
              >
                Yes
              </Button>
              <Button className="btn-lg btn-danger btn" onClick={button2}>
                No
              </Button>
            </div>
          </Modal.Footer>
          
        </Modal>
      </React.Fragment>
    );
  }
}
