// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	FormHelperText,
	Grid,
	MenuItem,
	Select,
	Typography
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { GuideType } from '../types/GuidelineTypes';
import { toast } from 'react-toastify';
import {
	handleCreateGuideline,
	handleUpdateGuidelineAPI
} from '../../../../../axios/services/mega-city-services/guideline-services/GuidelineService';

interface Image {
	id: number;
	link: string;
	file: File;
	base64: string;
}

interface Props {
	isOpen?: boolean;
	toggleModal?: () => void;
	clickedRowData: any;
	fetchAllGuidelines?: () => void;
	isTableMode?: string;
}

// @ts-ignore
function GuidelineEditModel({ isOpen, toggleModal, clickedRowData, isTableMode, fetchAllGuidelines }: Props) {
	const { t } = useTranslation('shippingTypes');
	const [isDataLoading, setDataLoading] = useState(false);
	const [images, setImages] = useState<Image[]>([]);
	const [category, setCategory] = useState<{ value: string; label: string }[]>([]);
	const [priority, setPriority] = useState<{ value: string; label: string }[]>([]);

	const schema = yup.object().shape({
		title: yup.string().required(t('Guidance title is required')),
		description: yup.string().required(t('Description is required')),
		category: yup.string().required(t('Category is required')),
		priority: yup.string().required(t('Priority is required')),
		relatedTo: yup.string().required(t('Related to is required'))
	});

	useEffect(() => {
		setCategory([{ value: 'Safety', label: t('SAFETY') }, {
			value: 'Maintenance', label: t('MAINTENANCE')
		}, { value: 'Training', label: t('TRAINING') }, { value: 'Pricing', label: t('PRICING') }]);
	}, [t]);

	useEffect(() => {
		setPriority([{ value: 'High', label: t('HIGH') }, { value: 'Medium', label: t('MEDIUM') }, {
			value: 'Law', label: t('LAW')
		}]);
	}, [t]);

	const handleSubmit = async (values: GuideType) => {
		const data = {
			guidanceId: values.guidanceId,
			title: values.title,
			description: values.description,
			category: values.category,
			priority: values.priority,
			relatedTo: values.relatedTo
		};

		try {
			if (clickedRowData?.guidanceId) {
				await handleUpdateGuidelineAPI(data);
				fetchAllGuidelines();
				toast.success('Guideline updated successfully');
			} else {
				await handleCreateGuideline(data);
				fetchAllGuidelines();
				toast.success('Guideline created successfully');
			}
			toggleModal();
		} catch (e) {
			console.error('Error:', e);
			toast.error('Error while saving guideline');
		}
	};


	return (<Dialog open={isOpen} maxWidth="xl" onClose={toggleModal}
					PaperProps={{ style: { top: '40px', margin: 0, position: 'absolute' } }}>
		<DialogTitle>
			<h6 className="text-gray-600 font-400">{t('Guideline management model')}</h6>
		</DialogTitle>
		<DialogContent>
			<Formik
				initialValues={{
					guidanceId: clickedRowData.guidanceId,
					title: clickedRowData.title,
					description: clickedRowData.description,
					category: clickedRowData.category,
					priority: clickedRowData.priority,
					relatedTo: clickedRowData.relatedTo
				}}
				onSubmit={handleSubmit}
				validationSchema={schema}
			>
				{({ setFieldValue, errors, touched }) => (<Form>
					<Grid container spacing={2}>
						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Guidance Id')}</Typography>
							<Field disabled={isTableMode === 'view' | isTableMode === 'new'} name="guidanceId"
								   component={TextFormField}
								   fullWidth size="small" />
						</Grid>
						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Title')} <span className="text-red"> *</span></Typography>
							<Field disabled={isTableMode === 'view'} name="title" component={TextFormField}
								   fullWidth size="small" />
						</Grid>
						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Description')} <span className="text-red"> *</span></Typography>
							<Field disabled={isTableMode === 'view'} name="description"
								   component={TextFormField} fullWidth size="small" />
						</Grid>
						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Category')} <span className="text-red"> *</span></Typography>
							<FormControl fullWidth size="small"
										 error={touched.category && Boolean(errors.category)}>
								<Field disabled={isTableMode === 'view'} name="category" as={Select}>
									{category.map(role => (
										<MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>))}
								</Field>
								{touched.category && errors.category &&
									<FormHelperText>{errors.category}</FormHelperText>}
							</FormControl>
						</Grid>

						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Priority')} <span className="text-red"> *</span></Typography>
							<FormControl fullWidth size="small"
										 error={touched.priority && Boolean(errors.priority)}>
								<Field disabled={isTableMode === 'view'} name="priority" as={Select}>
									{priority.map(role => (
										<MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>))}
								</Field>
								{touched.priority && errors.priority &&
									<FormHelperText>{errors.priority}</FormHelperText>}
							</FormControl>
						</Grid>
						<Grid item lg={3} md={3} sm={6} xs={12}>
							<Typography>{t('Related To')} <span className="text-red"> *</span></Typography>
							<Field disabled={isTableMode === 'view'} name="relatedTo" component={TextFormField}
								   fullWidth size="small" />
						</Grid>
						<Grid item lg={12} className="flex justify-end gap-2">
							<Button type="submit" variant="contained"
									disabled={isTableMode === 'view' || isDataLoading}
									className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-yellow-800 hover:bg-yellow-800/80"
							>
								{t('Save')}
								{isDataLoading && <CircularProgress size={24} className="ml-2" />}
							</Button>
							<Button variant="contained"
									className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-grey-300 hover:bg-grey-300/80"
									onClick={toggleModal}>
								{t('Cancel')}
							</Button>
						</Grid>
					</Grid>
				</Form>)}
			</Formik>
		</DialogContent>
	</Dialog>);
}

export default GuidelineEditModel;
