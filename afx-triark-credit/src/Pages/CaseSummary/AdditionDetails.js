import { Col, Collapse, Row } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import './index.scss';
import KYCDocument from './KYCDocument';
import PermanentAddress from './PermanentAddress';
import Utility from './Utility';
import CurrentOfficeAddress from './CurrentOfficeAddress';
import PermanentDetails from './PermanentDetails';
import EmploymentDetails from './EmploymentDetails';

const { Panel } = Collapse;

function AdditionalDetails(props) {
  const [panel, setActivePanel] = useState([]);
  const [tempkey, setTempkey] = useState(0);

  useEffect(() => {
    if (props.panel !== '') {
      setActivePanel(props.panel);
      setTempkey(Math.random());
    }
  }, [props.panel]);

  return (
    <Row gutter={[0, 20]}>
      <Col lg={24} key={tempkey}>
        <Collapse
          expandIconPosition='end'
          expandIcon={({ isActive }) =>
            isActive ? <MinusOutlined /> : <PlusOutlined />
          }
          activeKey={panel}
          onChange={(e) => setActivePanel(e)}
          className={'caseSummaryCollapse'}
        >
          {props.selfEmployedJourney
            ? selfEmployedMainPanel(props)
            : salariedMainPanel(props)}
        </Collapse>
      </Col>
    </Row>
  );
}

const resDropdwon = [
  'Owned With OHP Proof',
  'Owned Without OHP Proof',
  'Surrogate Owned',
];

var regex = new RegExp(resDropdwon.join('|'), 'i');

const salariedMainPanel = (props) => {
  const enabled = regex.test(props.data?.permanentaddresDetails?.residenceType);
  const titles =
    props?.actualPermanentAddDetailsFlag && !enabled
      ? [
          {
            label: 'KYC Document',
            Component: KYCDocument,
            componentProps: {
              data: props.data?.kycaddresDetails,
              isGuarantor: props?.isGuarantor,
              isMainApplicant: props.isMainApplicant,
              caseSummaryData: props?.caseSummaryData,
              getData: props?.getData,
              docType: props?.docType,
              getPanDetails: props?.getPanDetails,
              id: props?.id,
              caseFreeze: props?.caseFreeze,
              userFreeze: props?.userFreeze,
            },
            key: 'kyc',
          },
          // {
          //   label: "FI/CPV waiver document & Income Proof",
          //   Component: Utility,
          //   componentProps: {
          //     caseSummaryData: props?.caseSummaryData,
          //     isGuarantor: props?.isGuarantor,
          //     isMainApplicant: props.isMainApplicant,
          //     getData: props?.getData,
          //     getPanDetails: props?.getPanDetails,
          //     id: props?.id,
          //     caseFreeze: props?.caseFreeze,
          //     userFreeze: props?.userFreeze,
          //   },
          //   key: "utility",
          // },
          {
            label: 'Current Address',
            Component: PermanentAddress,
            componentProps: {
              data: props.data?.permanentaddresDetails,
              isGuarantor: props?.isGuarantor,
              isMainApplicant: props.isMainApplicant,
              getData: props?.getData,
              getPanDetails: props?.getPanDetails,
              id: props?.id,
              caseFreeze: props?.caseFreeze,
              userFreeze: props?.userFreeze,
            },
            key: 'pa',
          },
          // {
          //   label: "Employment Details",
          //   Component: EmploymentDetails,
          //   componentProps: {
          //     data: props.data?.employedetails,
          //     id: props?.id,
          //     isGuarantor: props?.isGuarantor,
          //     isMainApplicant: props.isMainApplicant,
          //     getData: props?.getData,
          //     getPanDetails: props?.getPanDetails,
          //     caseFreeze: props?.caseFreeze,
          //     userFreeze: props?.userFreeze,
          //     qdeData: props?.qdeData
          //   },
          //   key: "ed",
          // },
          {
            label: 'Permanent Address',
            Component: PermanentDetails,
            componentProps: {
              data: props?.data?.actualPermanentAddDetails,
              id: props?.id,
              isGuarantor: props?.isGuarantor,
              isMainApplicant: props.isMainApplicant,
              getData: props?.getData,
              getPanDetails: props?.getPanDetails,
              caseFreeze: props?.caseFreeze,
              userFreeze: props?.userFreeze,
            },
            key: 'edggpp',
          },
        ]
      : [
          {
            label: 'KYC Document',
            Component: KYCDocument,
            componentProps: {
              data: props.data?.kycaddresDetails,
              isGuarantor: props?.isGuarantor,
              isMainApplicant: props.isMainApplicant,
              caseSummaryData: props?.caseSummaryData,
              getData: props?.getData,
              docType: props?.docType,
              getPanDetails: props?.getPanDetails,
              id: props?.id,
              caseFreeze: props?.caseFreeze,
              userFreeze: props?.userFreeze,
            },
            key: 'kyc',
          },
          // {
          //   label: "FI/CPV waiver document & Income Proof",
          //   Component: Utility,
          //   componentProps: {
          //     caseSummaryData: props?.caseSummaryData,
          //     isGuarantor: props?.isGuarantor,
          //     isMainApplicant: props.isMainApplicant,
          //     getData: props?.getData,
          //     getPanDetails: props?.getPanDetails,
          //     id: props?.id,
          //     caseFreeze: props?.caseFreeze,
          //     userFreeze: props?.userFreeze,
          //   },
          //   key: "utility",
          // },
          {
            label: 'Current Address',
            Component: PermanentAddress,
            componentProps: {
              data: props.data?.permanentaddresDetails,
              isGuarantor: props?.isGuarantor,
              isMainApplicant: props.isMainApplicant,
              getData: props?.getData,
              getPanDetails: props?.getPanDetails,
              id: props?.id,
              caseFreeze: props?.caseFreeze,
              userFreeze: props?.userFreeze,
            },
            key: 'pa',
          },
          // {
          //   label: "Employment Details",
          //   Component: EmploymentDetails,
          //   componentProps: {
          //     data: props.data?.employedetails,
          //     id: props?.id,
          //     isGuarantor: props?.isGuarantor,
          //     isMainApplicant: props.isMainApplicant,
          //     getData: props?.getData,
          //     getPanDetails: props?.getPanDetails,
          //     caseFreeze: props?.caseFreeze,
          //     userFreeze: props?.userFreeze,
          //     qdeData: props?.qdeData
          //   },
          //   key: "ed",
          // },
        ];
  return titles.map((item, index) => {
    const { label, Component } = item;
    return (
      <Panel key={`${item.key}`} header={label}>
        <Component {...item.componentProps} />
      </Panel>
    );
  });
};

const selfEmployedMainPanel = (props) => {
  const enabled = regex.test(props.data?.permanentaddresDetails?.residenceType);
  const titles = enabled
    ? [
        {
          label: 'KYC Document',
          Component: KYCDocument,
          componentProps: {
            data: props.data?.kycaddresDetails,
            caseSummaryData: props?.caseSummaryData,
            id: props?.id,
            selfEmployedJourney: props?.selfEmployedJourney,
            getData: props?.getData,
            getPanDetails: props?.getPanDetails,
            getData: props?.getData,
            docType: props?.docType,
          },
          key: 'kyc',
        },
        // {
        //   label: "FI/CPV waiver document & Income Proof",
        //   Component: Utility,
        //   componentProps: {
        //     data: props.data?.utilityDetails,
        //     caseSummaryData: props?.caseSummaryData,
        //     getData: props?.getData,
        //     getPanDetails: props?.getPanDetails,
        //     id: props?.id,
        //     isGuarantor: props?.isGuarantor,
        //     isMainApplicant: props.isMainApplicant,
        //     caseFreeze: props?.caseFreeze,
        //     userFreeze: props?.userFreeze,
        //   },
        //   key: "utility",
        // },
        {
          label: 'Current Residence Address',
          Component: CurrentOfficeAddress,
          componentProps: {
            data: props.data?.currentOfficeAddresDetails,
            getData: props?.getData,
            id: props?.id,
            isGuarantor: props?.isGuarantor,
            isMainApplicant: props.isMainApplicant,
            caseFreeze: props?.caseFreeze,
            userFreeze: props?.userFreeze,
          },
          key: 'coa',
        },
        // {
        //   label: "Employment Details",
        //   Component: EmploymentDetails,
        //   componentProps: {
        //     data: props.data?.employedetails,
        //     id: props?.id,
        //     isGuarantor: props?.isGuarantor,
        //     isMainApplicant: props.isMainApplicant,
        //     caseFreeze: props?.caseFreeze,
        //     userFreeze: props?.userFreeze,
        //     getData: props?.getData,
        //   },
        //   key: "ed",
        // },
      ]
    : [
        {
          label: 'KYC Document',
          Component: KYCDocument,
          componentProps: {
            data: props.data?.kycaddresDetails,
            caseSummaryData: props?.caseSummaryData,
            id: props?.id,
            selfEmployedJourney: props?.selfEmployedJourney,
            getData: props?.getData,
            getPanDetails: props?.getPanDetails,
            getData: props?.getData,
            docType: props?.docType,
          },
          key: 'kyc',
        },
        // {
        //   label: "FI/CPV waiver document & Income Proof",
        //   Component: Utility,
        //   componentProps: {
        //     data: props.data?.utilityDetails,
        //     caseSummaryData: props?.caseSummaryData,
        //     getData: props?.getData,
        //     getPanDetails: props?.getPanDetails,
        //     id: props?.id,
        //     isGuarantor: props?.isGuarantor,
        //     isMainApplicant: props.isMainApplicant,
        //     caseFreeze: props?.caseFreeze,
        //     userFreeze: props?.userFreeze,
        //   },
        //   key: "utility",
        // },
        {
          label: 'Current Residence Address',
          Component: CurrentOfficeAddress,
          componentProps: {
            data: props.data?.currentOfficeAddresDetails,
            getData: props?.getData,
            id: props?.id,
            isGuarantor: props?.isGuarantor,
            isMainApplicant: props.isMainApplicant,
            caseFreeze: props?.caseFreeze,
            userFreeze: props?.userFreeze,
          },
          key: 'coa',
        },
        // {
        //   label: "Employment Details",
        //   Component: EmploymentDetails,
        //   componentProps: {
        //     data: props.data?.employedetails,
        //     id: props?.id,
        //     isGuarantor: props?.isGuarantor,
        //     isMainApplicant: props.isMainApplicant,
        //     caseFreeze: props?.caseFreeze,
        //     userFreeze: props?.userFreeze,
        //     getData: props?.getData,
        //   },
        //   key: "ed",
        // },
        {
          label: 'Permanent Address',
          Component: PermanentDetails,
          componentProps: {
            data: props.data?.actualPermanentAddDetails,
            id: props?.id,
            isGuarantor: props?.isGuarantor,
            isMainApplicant: props.isMainApplicant,
            caseFreeze: props?.caseFreeze,
            userFreeze: props?.userFreeze,
            getData: props?.getData,
            getPanDetails: props?.getPanDetails,
          },
          key: 'edperma',
        },
      ];

  return titles.map((item, index) => {
    const { label, Component } = item;
    return (
      <Panel key={`${item.key}`} header={label}>
        <Component {...item.componentProps} />
      </Panel>
    );
  });
};

export default AdditionalDetails;
