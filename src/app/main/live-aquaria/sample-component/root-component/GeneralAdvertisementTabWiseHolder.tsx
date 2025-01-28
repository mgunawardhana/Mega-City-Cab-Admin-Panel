import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import CustomTab from '../../../../common/CustomTab';
import GeneralView from './component/general-advertisement-general-view/GeneralView';
import UploadThumbnails from './component/thumbnail-options/UploaadThumbnails';

import {
	publishDiversAdvertisements
} from '../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';
import {
	fetchDetailsBySKU, rejectGeneralAdvertisementByID
} from '../../../../axios/services/live-aquaria-services/general-advertisement-services/GeneralAdvertisementService';
// @ts-ignore
import {
	ArticleOptionsSubmitDataType
} from '../../content-management/article-category/article-category-types/ArticleCategoryTypes';
// @ts-ignore
import {
	productOptionsTableDataType
} from '../../divers-den-advertisement/divers-den-advertisements/divers-den-advertisements-types/DriversDenAdvertisementsTypes';
import GeneralAdvertisementApproveComp
	from '../general-advertisement-publish/components/GeneralAdvertisementApproveComp';
import GeneralAdvertisementRejectComp from '../general-advertisement-publish/components/GeneralAdvertisementRejectComp';
import {
	GeneralAdvMainObject,
	GeneralAdvModifiedDataType,
	GeneralAdvRelatedArticle,
	GeneralAdvSearchByIdResponseType,
	GeneralAdvShippingMethodSubmitData,
	imageType,
	MediaModifyResponseData
} from './types/general-advertisement-types';

function CustomTabPanel({ children, value, index, ...other }) {
	return (<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 2 }}>{children}</Box>}
		</div>);
}

interface ErrorResponse {
	response?: {
		status?: number; data?: {
			message?: string;
		};
	};
}

interface Props {
	clickedRowData?: GeneralAdvModifiedDataType;
	isSearchEnabled?: boolean;
	isSaveBtnEnabled?: boolean;
	ifWeNeedClearForm?: string;
	isTableMode?: string;
	isPublishAds?: boolean;
	handleNavigateMainComp: () => void;
}

function GeneralAdvertisementTabWiseHolder({
											   clickedRowData,
											   isSearchEnabled,
											   isSaveBtnEnabled,
											   ifWeNeedClearForm,
											   isTableMode,
											   isPublishAds,
											   handleNavigateMainComp
										   }: Props) {
	const { t } = useTranslation('sampleComponent');
	const [searchValue, setSearchValue] = useState<string>('');
	const [value, setValue] = useState<number>(0);
	const [loading, setLoading] = useState(false);
	const [generalViewValues, setGeneralViewValues] = useState<GeneralAdvMainObject>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isMedia, setIsMedia] = useState<MediaModifyResponseData>({});
	const [initialArticleValues, setArticleInitialValues] = useState<ArticleOptionsSubmitDataType>({
		cisCode: '', tableData: []
	});

	const [initialProductValues, setProductInitialValues] = useState<productOptionsTableDataType>({
		cisCode: '', tableData: []
	});

	const [initialShippingValues, setInitialShippingValues] = useState<GeneralAdvShippingMethodSubmitData>({});
	const [isOpenRejectModal, setOpenRejectModal] = useState(false);
	const [isOpenReasonModal, setOpenReasonModal] = useState(false);
	const toggleRejectModal = () => setOpenRejectModal(!isOpenRejectModal);
	const toggleReasonModal = () => setOpenReasonModal(!isOpenReasonModal);
	const [isPublishDataLoading, setPublishDataLoading] = useState(false);
	const [isRejectDataLoading, setRejectDataLoading] = useState(false);

	useEffect(() => {
		if (clickedRowData.id) {
			fetchDataForProfileView();
		}
	}, [clickedRowData]);

	const handleChange = (event, newValue: number) => {
		setValue(newValue);
	};

	const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};

	const fetchDataForProfileView = async () => {
		setIsLoading(true);
		const id = searchValue || clickedRowData.code;
		try {
			const response: GeneralAdvSearchByIdResponseType = await fetchDetailsBySKU(id);
			setGeneralViewValues(response.data);

			const videoLink: string = response?.data?.item_media?.find((item) => item.type === 'video_link')?.link || '';
			// console.log('videoIn',videoIn);

			const imageDetails: imageType[] = response?.data?.item_media
				?.filter((item) => item.type === 'image')
				.map((item) => ({ id: item.id, link: item.link }));

			const videoDetails: imageType[] = response?.data?.item_media
				?.filter((item) => item.type === 'video')
				.map((item) => ({ id: item.id, link: item.link }));

			const mediaData: MediaModifyResponseData = {
				video_link: videoLink, imagesIn: imageDetails, videoIn: videoDetails
			};
			setIsMedia(mediaData);

			const relatedProductData = {
				cisCode: '', tableData: response?.data?.related_product?.map((item) => ({
					id: item?.id, cisCode: item?.code, title: item?.title
				}))
			};

			setProductInitialValues(relatedProductData);

			const articleData: ArticleOptionsSubmitDataType = {
				cisCode: '', tableData: response.data?.related_article?.map((item: GeneralAdvRelatedArticle) => ({
					id: item?.id, cisCode: item?.code, title: item?.title, author: item?.author
				}))
			};

			const shippingMethods = {
				allowEmails: response?.data?.is_availability_emails === 1,
				loyaltyRewards: response?.data?.is_loyalty_rewards === 1,
				weeklySpecial: response?.data?.is_weekly_special === 1,
				autoDelivery: response?.data?.is_auto_delivery === 1,
				specialMessage: response?.data?.special_message,
				selectedGuaranteeOption: response?.data?.guarantee_options?.[0]?.id
			};

			setArticleInitialValues(articleData);
			setInitialShippingValues(shippingMethods);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error?.response?.status === 404) {
				toast.error('Not Found');
				return;
			}

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		}
	};

	const onReject = () => {
		toggleRejectModal();
	};

	const onApprove = () => {
		toggleReasonModal();
	};

	const handleAlertForm = async (values: { reason: string }) => {
		toggleRejectModal();

		if (clickedRowData?.id) {
			setRejectDataLoading(true);
			const id = clickedRowData.id ?? null;
			const data = {
				status: '2', reject_reason: values.reason ?? null
			};
			try {
				const response = await rejectGeneralAdvertisementByID(id, data);
				setRejectDataLoading(false);
				toast.success('Rejected Successfully');
				handleNavigateMainComp();
			} catch (error) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (error?.response && error?.response?.data?.message) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
					toast.error(error?.response?.data?.message);
				} else {
					toast.error('Internal server error');
				}

				setRejectDataLoading(false);
			}
		}
	};

	const handleReasonAlertForm = async () => {
		toggleReasonModal();

		if (clickedRowData?.id) {
			setPublishDataLoading(true);
			const data = {
				advertisement_id: [clickedRowData.id ? clickedRowData.id : null]
			};
			try {
				const response = await publishDiversAdvertisements(data);
				setPublishDataLoading(false);
				toast.success('Published Successfully');
				handleNavigateMainComp();
			} catch (error) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (error?.response && error?.response?.data?.message) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
					toast.error(error?.response?.data?.message);
				} else {
					toast.error('Internal server error');
				}

				setPublishDataLoading(false);
			}
		}
	};

	function getHeaderTitle(isTableMode) {
		if (isTableMode === 'view') {
			return 'View';
		}

		if (isTableMode === 'edit') {
			return 'Edit';
		}

		return 'Create';
	}

	return (<div className="min-w-full max-w-[100vw]">
			<Grid
				container
				spacing={2}
				className="pt-0 px-[15px] mt-[-5px]"
			>
				<Grid
					item
					xl={9}
					md={8}
					sm={6}
					xs={12}
					className="pt-[5px!important]"
				>
					<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-600">
						{getHeaderTitle(isTableMode)} {t('GENERAL_ADVERTISEMENT')}
					</h6>
				</Grid>
				<Grid
					item
					xl={3}
					md={4}
					sm={6}
					xs={12}
					className="pt-[5px!important]"
				>
					{!clickedRowData?.id ? (<Grid
							container
							spacing={2}
						>
							<Grid
								item
								md={8}
								sm={8}
								xs={12}
								className="pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('LAQ item master data ID')}
									<span className="text-red"> *</span>
								</Typography>
								<TextField
									variant="outlined"
									fullWidth
									size="small"
									placeholder=""
									value={searchValue}
									onChange={handleSearchInputChange}
								/>
							</Grid>
							<Grid
								item
								md={4}
								sm={4}
								xs={12}
								className="!pt-[5px] sm:pt-[26px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-yellow-800 hover:bg-yellow-800/80"
									variant="contained"
									size="small"
									color="primary"
									fullWidth
									onClick={fetchDataForProfileView}
								>
									{t('SEARCH_BUTTON')}
								</Button>
							</Grid>
						</Grid>) : null}
				</Grid>

				{isLoading ? (<Grid
						item
						md={12}
						sm={12}
						xs={12}
						className="flex justify-center items-center w-full min-h-[100px]"
					>
						<CircularProgress className="text-primaryBlueLight" />
					</Grid>) : (<Grid
						item
						md={12}
						sm={12}
						xs={12}
					>
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="pt-[0!important]"
							>
								<Tabs
									value={value}
									onChange={handleChange}
									aria-label="basic tabs example"
									variant="fullWidth"
									className="h-[30px] min-h-[40px] border-b border-gray-300"
								>
									<CustomTab
										label={t('GENERAL')}
										index={0}
									/>
									<CustomTab
										label={t('UPLOADS')}
										index={1}
									/>
								</Tabs>

								<CustomTabPanel
									value={value}
									index={0}
								>
									<GeneralView
										clickedRowData={generalViewValues}
										isTableMode={isTableMode}
										fetchDataForProfileView={fetchDataForProfileView}
									/>
								</CustomTabPanel>
								<CustomTabPanel
									value={value}
									index={1}
								>
									<UploadThumbnails
										clickedRowData={generalViewValues}
										isTableMode={isTableMode}
										fetchDataForProfileView={fetchDataForProfileView}
										isMedia={isMedia}
									/>
								</CustomTabPanel>
							</Grid>

							{isPublishAds && (<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex items-end mb-10 justify-end gap-[10px] formikFormField pt-[0!important] px-[15px]"
								>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-red-400 hover:bg-red-400/80"
										type="button"
										variant="contained"
										size="medium"
										onClick={() => onReject()}
									>
										{t('Reject')}
										{isRejectDataLoading ? (<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>) : null}
									</Button>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="button"
										variant="contained"
										size="medium"
										onClick={() => onApprove()}
									>
										{t('Approve')}
										{isPublishDataLoading ? (<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>) : null}
									</Button>
								</Grid>)}
						</Grid>
					</Grid>)}
			</Grid>

			{isOpenRejectModal && (<GeneralAdvertisementRejectComp
					isOpen={isOpenRejectModal}
					toggleModal={toggleRejectModal}
					handleAlertForm={handleAlertForm}
				/>)}

			{isOpenReasonModal && (<GeneralAdvertisementApproveComp
					isOpen={isOpenReasonModal}
					toggleModal={toggleReasonModal}
					handleAlertForm={handleReasonAlertForm}
				/>)}
		</div>);
}

export default GeneralAdvertisementTabWiseHolder;
