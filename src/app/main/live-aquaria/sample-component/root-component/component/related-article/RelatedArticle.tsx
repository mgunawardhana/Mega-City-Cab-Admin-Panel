import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Button,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CommonHeading from '../../../../../../common/FormComponents/CommonHeading';
import { getAllArticleWithOutPagination } from '../../../../../../axios/services/live-aquaria-services/article-services/ArticleServices';
import { taggedRelatedArticles } from '../../../../../../axios/services/live-aquaria-services/general-advertisement-services/GeneralAdvertisementService';
import {
	ArticleOptionsSetDataType,
	ArticleOptionsSubmitDataType,
	ArticleResponseType,
	ArticleType
} from '../../../../content-management/article-category/article-category-types/ArticleCategoryTypes';
import {
	productOptionsDropDownDataType,
	productOptionsTableDataType
} from '../../../../divers-den-advertisement/divers-den-advertisements/divers-den-advertisements-types/DriversDenAdvertisementsTypes';
import { OptionsSetDataDropDownData } from '../../../../laq-master-data/product-list/product-list-types/ProductListTypes';
import { GeneralAdvMainObject } from '../../types/general-advertisement-types';

type RelatedProductProps = {
	clickedRowData: GeneralAdvMainObject;
	isTableMode: string;
	fetchDataForProfileView: () => void;
	initialArticleValues: ArticleOptionsSubmitDataType;
};

function RelatedArticle({
	clickedRowData,
	isTableMode,
	fetchDataForProfileView,
	initialArticleValues
}: RelatedProductProps) {
	const { t } = useTranslation('sampleComponent');

	const [cisCode, setCisCode] = useState<productOptionsDropDownDataType[]>([]);
	const [data, setData] = useState<ArticleOptionsSetDataType[]>([]);
	const [isArticleDataLoading, setArticleDataLoading] = useState(false);

	const [initialValues, setInitialValues] = useState<ArticleOptionsSubmitDataType>(
		initialArticleValues.tableData
			? initialArticleValues
			: {
					cisCode: '',
					tableData: []
				}
	);

	useEffect(() => {
		getCisCodeData();
	}, []);

	const getCisCodeData = async () => {
		try {
			const response: ArticleType = await getAllArticleWithOutPagination();
			const optionsSetData: ArticleOptionsSetDataType[] = response.data.map((item: ArticleResponseType) => ({
				id: item.id,
				cisCode: item.code,
				title: item.title,
				author: item.author
			}));

			setData(optionsSetData);
			const options: productOptionsDropDownDataType[] = response.data.map((item: ArticleResponseType) => ({
				label: item.code,
				value: item.code
			}));
			setCisCode(options);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteRemark = (
		productId: string,
		setFieldValue: FormikHelpers<productOptionsTableDataType>['setFieldValue'],
		values: productOptionsTableDataType
	) => {
		const updatedTableData = values.tableData.filter((row) => row.cisCode !== productId);
		setFieldValue('tableData', updatedTableData);
	};

	const handleSave = async (values: ArticleOptionsSubmitDataType) => {
		const ids = values.tableData.map((row) => row.id);

		if (ids.length === 0) {
			toast.error('At least one related article must be added.');
			return;
		}

		const data: { related_articles: string[] } = {
			related_articles: ids
		};

		const message: string = isTableMode === 'edit' ? 'Updated successfully' : 'Created successfully';

		try {
			setArticleDataLoading(true);

			if (clickedRowData?.id) {
				await taggedRelatedArticles(clickedRowData.id, data);
				fetchDataForProfileView();
				toast.success(message);
				setArticleDataLoading(false);
			} else {
				toast.error('General advertisement Id is required');
				setArticleDataLoading(false);
			}
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (error?.response && error?.response?.data?.message) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
				toast.error(error?.response?.data?.message);
			} else {
				toast.error('Internal server error');
			}

			setArticleDataLoading(false);
		}
	};

	const schema = yup.object().shape({});

	return (
		<div className="min-w-full max-w-[100vw]">
			<Paper className="rounded-[0px] p-[16px]">
				<Formik
					initialValues={initialValues}
					validationSchema={schema}
					onSubmit={handleSave}
				>
					{({ values, setFieldValue, resetForm }) => (
						<Form>
							<Grid
								container
								spacing={2}
							>
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									key={1}
								>
									<CommonHeading title="Related Articles" />
									<Grid
										container
										spacing={2}
										className="mt-0"
									>
										<Grid
											item
											lg={3}
											md={4}
											sm={6}
											xs={12}
											className="formikFormField pt-[5px!important]"
										>
											<Typography className="formTypography">{t('Article ID')}</Typography>
											<div className="flex justify-between items-center gap-[10px]">
												<Autocomplete
													className="w-full"
													disabled={isTableMode === 'view'}
													options={cisCode}
													getOptionLabel={(option: OptionsSetDataDropDownData) =>
														option.label
													}
													renderInput={(params) => (
														<TextField
															{...params}
															label=""
															variant="outlined"
															size="small"
															fullWidth
														/>
													)}
													onChange={(_, newValue: OptionsSetDataDropDownData) => {
														setFieldValue(`cisCode`, newValue ? newValue.value : '');
													}}
													value={
														cisCode.find((option) => option.value === values.cisCode) ||
														null
													}
													isOptionEqualToValue={(option, value) => option.value === value}
													clearOnBlur
													handleHomeEndKeys
													freeSolo
													disableClearable
												/>
												<IconButton
													onClick={() => {
														const currentCisCode = values.cisCode;

														if (currentCisCode) {
															// Filter the dataset based on the input cisCode
															const filteredData = data.filter(
																(item) => item.cisCode === currentCisCode
															);

															if (filteredData.length > 0) {
																// Check for duplicates in the existing tableData
																const isDuplicate = values.tableData.some(
																	(row) => row.cisCode === currentCisCode
																);

																if (isDuplicate) {
																	toast.error(`${currentCisCode} is already added.`);
																} else {
																	// Update table data with filtered results
																	const updatedTableData = [
																		...values.tableData,
																		...filteredData
																	];
																	setFieldValue('tableData', updatedTableData);
																	setFieldValue('cisCode', '');
																}
															}
														}
													}}
													className="text-primaryBlue"
													disabled={isTableMode === 'view'}
												>
													<AddCircleIcon />
												</IconButton>
											</div>
										</Grid>
										<Grid
											item
											xs={12}
											className="pt-[10px!important]"
										>
											<TableContainer>
												<Table
													size="small"
													className="custom-table"
												>
													<TableHead>
														<TableRow>
															<TableCell
																sx={{
																	backgroundColor: '#354a95',
																	color: 'white'
																}}
															>
																{t('Article ID')}
															</TableCell>
															<TableCell
																sx={{
																	backgroundColor: '#354a95',
																	color: 'white'
																}}
															>
																{t('Title')}
															</TableCell>
															<TableCell
																sx={{
																	backgroundColor: '#354a95',
																	color: 'white'
																}}
															>
																{t('Author')}
															</TableCell>
															<TableCell
																sx={{
																	backgroundColor: '#354a95',
																	color: 'white'
																}}
															>
																{t('Action')}
															</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{values.tableData.map((row, rowIndex) => (
															<TableRow key={rowIndex}>
																<TableCell>{row.cisCode}</TableCell>
																<TableCell>{row.title}</TableCell>
																<TableCell>{row.author}</TableCell>
																<TableCell>
																	{isTableMode === 'view' ? (
																		<DeleteIcon
																			className="text-red-400"
																			fontSize="small"
																		/>
																	) : (
																		<DeleteIcon
																			className="text-red-400"
																			fontSize="small"
																			sx={{ cursor: 'pointer' }}
																			onClick={() =>
																				handleDeleteRemark(
																					row.cisCode,
																					setFieldValue,
																					values
																				)
																			}
																		/>
																	)}
																</TableCell>
															</TableRow>
														))}
													</TableBody>
												</Table>
											</TableContainer>
										</Grid>
									</Grid>
								</Grid>

								{/* Submit Buttons */}
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-center gap-[10px] pt-[10px!important]"
								>
									{isTableMode !== 'view' && (
										<Button
											className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={isTableMode === 'view'}
										>
											{isTableMode === 'edit' ? 'Update' : 'Save'}
											{isArticleDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</Paper>
		</div>
	);
}

export default RelatedArticle;
