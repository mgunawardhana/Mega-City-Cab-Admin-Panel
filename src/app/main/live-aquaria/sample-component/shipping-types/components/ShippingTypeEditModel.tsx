import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Button,
	Checkbox,
	Chip,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	Grid,
	IconButton,
	MenuItem,
	OutlinedInput,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
	fetchAllCategoryTypesData,
	updateShippingType
} from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';
import { ShippingCreateType, ShippingTypeItemCategoryResponse, ShippingTypeModifiedData } from '../types/ShippingTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: ShippingTypeModifiedData;
	fetchAllShippingTypes?: () => void;
	isTableMode?: string;
}

interface Category {
	id: string;
	name: string;
	sub_item_categories?: Category[];
	subCategories?: Category[];
}

interface DropCategory {
	id?: string;
	name?: string;
}

function ShippingTypeEditModal({ isOpen, toggleModal, clickedRowData, fetchAllShippingTypes, isTableMode }: Props) {
	const { t } = useTranslation('shippingTypes');
	const [allCategories, setAllCategories] = useState<Category[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<Category | string>('');
	const [isDataLoading, setDataLoading] = useState(false);

	const extractSubCategories = (categories: Category[], parentName: string = '') => {
		let result: Category[] = [];
		categories.forEach((category) => {
			const fullName = parentName ? `${parentName} > ${category.name}` : category.name;
			result.push({
				id: category.id,
				name: fullName,
				subCategories: category.sub_item_categories
			});

			if (category.sub_item_categories && category.sub_item_categories.length > 0) {
				result = result.concat(extractSubCategories(category.sub_item_categories, fullName));
			}
		});
		return result;
	};

	const fetchAllCategories = async () => {
		try {
			const response: { data?: Category[] } = await fetchAllCategoryTypesData();
			const subCategories = extractSubCategories(response.data);
			setAllCategories(subCategories);
		} catch (error) {
			toast.error('Error fetching categories');
		}
	};

	useEffect(() => {
		fetchAllCategories();
	}, []);

	useEffect(() => {
		if (clickedRowData?.item_category && allCategories.length > 0) {
			const transformedData = clickedRowData.item_category.map((item: ShippingTypeItemCategoryResponse) => ({
				id: item.id,
				name: item.name
			}));
			setSelectedCategories(transformedData);
		}
	}, [clickedRowData, allCategories]);

	const handleAddCategory = () => {
		if (selectedCategory) {
			const isCategoryAlreadyAdded = selectedCategories.some(
				(cat) => cat.id === (selectedCategory as Category).id
			);

			if (isCategoryAlreadyAdded) {
				toast.warning('Already added Category, please check with previous ones.');
			} else {
				setSelectedCategories((prev) => [...prev, selectedCategory as Category]);
				setSelectedCategory('');
			}
		}
	};
	const handleRemoveCategory = (category: Category) => {
		setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
	};

	const handleUpdateShippingType = async (values: ShippingCreateType) => {
		const data = {
			name: values.shippingType,
			item_category: values.product_category,
			create_date: values.create_date,
			allow_transit_delay: values.allow_transit_delay,
			is_active: clickedRowData.is_active
		};

		if (values.product_category.length !== 0) {
			setDataLoading(true);
			try {
				await updateShippingType(clickedRowData.id, data);
				fetchAllShippingTypes();
				toast.success('Shipping type updated successfully');
				toggleModal();
				setDataLoading(false);
			} catch (error) {
				toast.error('Error updating shipping type');
				setDataLoading(false);
			}
		} else {
			toast.error('At least one category is required.');
		}
	};

	return (
		<Dialog
			open={isOpen}
			maxWidth="md"
			onClose={toggleModal}
			PaperProps={{
				style: {
					top: '40px',
					margin: 0,
					position: 'absolute'
				}
			}}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{t('EDIT_SHIPPING_TYPE')}
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						shippingType: clickedRowData?.shipping_type_name || '',
						product_category: [],
						create_date: clickedRowData?.create_date || '',
						allow_transit_delay: clickedRowData?.allow_transit_delay === 'Allowed'
					}}
					onSubmit={(values: ShippingCreateType) => {
						const categoryIds = selectedCategories.map((category) => category.id);
						values.product_category = categoryIds;
						handleUpdateShippingType(values);
					}}
					validationSchema={null}
				>
					{({ dirty, values, handleChange, setFieldValue }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								<Grid
									item
									lg={4}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('Shipping Type Name')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isTableMode === 'view'}
										name="shippingType"
										component={TextFormField}
										fullWidth
										size="small"
										placeholder={t('Placeholder')}
									/>
								</Grid>

								<Grid
									item
									lg={8}
									md={8}
									sm={6}
									xs={12}
									className="pt-[5px!important] flex items-center gap-[5px]"
								>
									<FormControl
										fullWidth
										size="small"
									>
										<Typography className="formTypography">
											{t('Categories')}
											<span className="text-red"> *</span>
										</Typography>
										<Select
											labelId="demo-single-chip-label"
											disabled={isTableMode === 'view'}
											id="demo-single-chip"
											value={(selectedCategory as Category)?.id || ''}
											onChange={(event) => {
												const selectedId = event.target.value;
												const selectedCategoryObj = allCategories.find(
													(category) => category.id === selectedId
												);
												setSelectedCategory(selectedCategoryObj || '');
											}}
											input={<OutlinedInput id="select-single-chip" />}
											renderValue={(selected) => {
												const selectedCategoryObj = allCategories.find(
													(category) => category.id === selected
												);
												return (
													<Chip
														disabled={isTableMode === 'view'}
														key={selectedCategoryObj?.id}
														label={selectedCategoryObj?.name}
														size="small"
													/>
												);
											}}
										>
											{allCategories.map((category: Category) => (
												<MenuItem
													key={category.id}
													value={category.id} // Pass the ID instead of the whole object
												>
													{category.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<IconButton
										disabled={isTableMode === 'view'}
										onClick={handleAddCategory}
										size="medium"
										className="text-primaryBlue mt-[20px]"
									>
										<AddCircleIcon />
									</IconButton>
								</Grid>

								<Grid
									item
									lg={4}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('Created Date')}</Typography>
									<TextFormDateField
										name="create_date"
										type="date"
										placeholder=""
										id="create_date"
										disabled
									/>
								</Grid>

								<Grid
									item
									lg={8}
									md={8}
									sm={6}
									xs={12}
									className="pt-[5px!important] flex items-center gap-[5px]"
								>
									<FormControlLabel
										className="mt-[20px]"
										disabled={isTableMode === 'view'}
										name="allow_transit_delay"
										id="allow_transit_delay"
										control={<Checkbox color="primary" />}
										label="Allow Transit Delay"
										checked={values.allow_transit_delay}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
											setFieldValue('allow_transit_delay', event.target.checked)
										}
									/>
								</Grid>

								<Grid
									item
									xs={12}
									lg={12}
									md={12}
									className="pt-[5px!important]"
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
															color: 'white',
															padding: '2px'
														}}
													>
														{t('Category')}
													</TableCell>
													<TableCell
														sx={{
															backgroundColor: '#354a95',
															color: 'white',
															padding: '2px'
														}}
													>
														{t('Action')}
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{selectedCategories.length > 0 ? (
													selectedCategories.map((category, index) => (
														<TableRow key={index}>
															<TableCell sx={{ padding: '2px' }}>
																{category.name}
															</TableCell>
															<TableCell sx={{ padding: '2px' }}>
																<IconButton
																	disabled={isTableMode === 'view'}
																	onClick={() => handleRemoveCategory(category)}
																	size="small"
																	className="text-red-400"
																>
																	<DeleteIcon />
																</IconButton>
															</TableCell>
														</TableRow>
													))
												) : (
													<TableRow>
														<TableCell
															colSpan={2}
															align="center"
															sx={{ padding: '2px' }}
														>
															{t('No categories selected')}
														</TableCell>
													</TableRow>
												)}
											</TableBody>
										</Table>
									</TableContainer>
								</Grid>

								<Grid
									item
									lg={12}
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-start gap-[10px] pt-[10px!important]"
								>
									{isTableMode === 'edit' && (
										<Button
											type="submit"
											variant="contained"
											className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										>
											{t('Save')}
											{isDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}

									<Button
										variant="contained"
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										onClick={toggleModal}
									>
										{t('Cancel')}
									</Button>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

export default ShippingTypeEditModal;
