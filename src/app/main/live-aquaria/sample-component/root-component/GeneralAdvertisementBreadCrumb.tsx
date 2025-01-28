import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BreadcrumbLink from '../../../../common/FormComponents/BreadcrumbLink';
import GeneralAdvertisementView from './component/GeneralAdvertisementView';
import SampleThree from './component/SampleThree';
import SampleTabFour from './component/SampleTabFour';
import SampleTabFive from './component/SampleTabFive';
import GeneralAdvertisementTabWiseHolder from './GeneralAdvertisementTabWiseHolder';
import { GeneralAdvModifiedDataType } from './types/general-advertisement-types';

function BreadCrumb() {
	const { t } = useTranslation('sampleComponent');

	const [activeTab, setActiveTab] = useState<string>(t('GENERAL_ADVERTISEMENT_KEY'));
	const [clickedRowData, setClickedRowData] = useState<GeneralAdvModifiedDataType>({});
	const [isTableMode, setIsTableMode] = useState<string>('');

	const handleNavigation = (tab: string) => {
		setActiveTab(tab);
	};

	const renderActiveComponent = () => {
		switch (activeTab) {
			case 'GENERAL_ADVERTISEMENT_KEY':
				return (
					<GeneralAdvertisementView
						onCreateClick={() => {
							handleNavigation('CREATE_GENERAL_ADVERTISEMENT_KEY');
							setIsTableMode('');
						}}
						onViewClick={(rowData: GeneralAdvModifiedDataType, isTableMode: string) => {
							setIsTableMode(isTableMode);
							setClickedRowData(rowData);
							handleNavigation('VIEW_GENERAL_ADVERTISEMENT_KEY');
						}}
						onEditClick={(rowData: GeneralAdvModifiedDataType, isTableMode: string) => {
							setIsTableMode(isTableMode);
							setClickedRowData(rowData);
							handleNavigation('EDIT_GENERAL_ADVERTISEMENT_KEY');
						}}
					/>
				);
			case 'CREATE_GENERAL_ADVERTISEMENT_KEY':
				return (
					<GeneralAdvertisementTabWiseHolder
						clickedRowData={{}}
						isSearchEnabled={false}
						isSaveBtnEnabled={false}
						ifWeNeedClearForm="YES, CREATE_GENERAL_ADVERTISEMENT_KEY"
						isTableMode={isTableMode}
						isPublishAds={false}
						handleNavigateMainComp={handleNavigateMainComp}
					/>
				);
			case 'VIEW_GENERAL_ADVERTISEMENT_KEY':
				return (
					<GeneralAdvertisementTabWiseHolder
						clickedRowData={clickedRowData}
						isSearchEnabled
						isSaveBtnEnabled
						ifWeNeedClearForm="NO"
						isTableMode={isTableMode}
						isPublishAds={false}
						handleNavigateMainComp={handleNavigateMainComp}
					/>
				);
			case 'EDIT_GENERAL_ADVERTISEMENT_KEY':
				return (
					<GeneralAdvertisementTabWiseHolder
						clickedRowData={clickedRowData}
						isSearchEnabled={false}
						isSaveBtnEnabled={false}
						ifWeNeedClearForm="NO"
						isTableMode={isTableMode}
						isPublishAds={false}
						handleNavigateMainComp={handleNavigateMainComp}
					/>
				);

			case 'SAMPLE_TAB_THREE':
				return <SampleThree />;
			case 'SAMPLE_TAB_FOUR':
				return <SampleTabFour onEditClick={() => handleNavigation('SAMPLE_TAB_FIVE')} />;
			case 'SAMPLE_TAB_FIVE':
				return <SampleTabFive />;
			default:
				return (
					<GeneralAdvertisementView
						onCreateClick={() => handleNavigation('CREATE_GENERAL_ADVERTISEMENT_KEY')}
					/>
				);
		}
	};

	const handleNavigateMainComp = () => {
		handleNavigation('GENERAL_ADVERTISEMENT_KEY');
	};

	const renderBreadcrumbs = () => {
		const breadcrumbs = [{ label: t('DEFAULT'), tab: 'GENERAL_ADVERTISEMENT_KEY' }];

		breadcrumbs.push({ label: ' General Advertisement', tab: 'GENERAL_ADVERTISEMENT_KEY' });

		if (['CREATE_GENERAL_ADVERTISEMENT_KEY', 'SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({
				label: t('CREATE_GENERAL_ADVERTISEMENT'),
				tab: 'CREATE_GENERAL_ADVERTISEMENT_KEY'
			});
		}

		if (['VIEW_GENERAL_ADVERTISEMENT_KEY', 'SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({
				label: t('VIEW_GENERAL_ADVERTISEMENT'),
				tab: 'VIEW_GENERAL_ADVERTISEMENT_KEY'
			});
		}

		if (['EDIT_GENERAL_ADVERTISEMENT_KEY', 'SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({
				label: t('EDIT_GENERAL_ADVERTISEMENT'),
				tab: 'EDIT_GENERAL_ADVERTISEMENT_KEY'
			});
		}

		if (activeTab === 'SAMPLE_TAB_THREE') {
			breadcrumbs.push({
				label: 'SampleTabThree',
				tab: 'SAMPLE_TAB_THREE'
			});
		}

		if (['SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({
				label: 'SampleTabFour',
				tab: 'SAMPLE_TAB_FOUR'
			});
		}

		if (activeTab === 'SAMPLE_TAB_FIVE') {
			breadcrumbs.push({
				label: 'SampleTabFive',
				tab: 'SAMPLE_TAB_FIVE'
			});
		}

		return breadcrumbs.map((breadcrumb, index) => (
			<React.Fragment key={index}>
				{index !== 0 && (
					<Typography className="text-[8px] sm:text-[10px] lg:text-[12px] text-gray-600 font-500 leading-[1.2]">
						/
					</Typography>
				)}
				<BreadcrumbLink
					label={breadcrumb.label}
					onClick={breadcrumb.tab ? () => handleNavigation(breadcrumb.tab) : undefined}
				/>
			</React.Fragment>
		));
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<div className="grid grid-cols-12 gap-[5px] w-full">
				<div className="col-span-12">
					<h6 className="w-full flex flex-wrap items-center gap-[5px] text-[8px] sm:text-[10px] lg:text-[12px] text-gray-600 font-500 leading-[1.2] px-[15px] py-[4px]">
						{renderBreadcrumbs()}
					</h6>
				</div>
				<div className="col-span-12">{renderActiveComponent()}</div>
			</div>
		</div>
	);
}

export default BreadCrumb;
