import { Grid, Paper, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import TextFormField from '../../../../../../common/FormComponents/FormTextField';
import { GeneralAdvMainObject } from '../../types/general-advertisement-types';

interface Props {
	clickedRowData: GeneralAdvMainObject;
}

interface FormValues {
	[key: string]: string;
}

function QuickStatusView({ clickedRowData }: Props) {
	const { t } = useTranslation();

	const flattenedAttributes = useMemo(() => {
		if (Array.isArray(clickedRowData?.item_attributes)) {
			return clickedRowData.item_attributes.flat();
		}

		return [];
	}, [clickedRowData]);

	const quickStats = flattenedAttributes;

	const schema = yup.object().shape({});

	const initialValues: FormValues = useMemo(() => {
		return quickStats.reduce((acc, item) => {
			if (item?.attributes) {
				acc[item.name] = item.attributes.map((attr) => attr.name).join(', ');
			}

			return acc;
		}, {} as FormValues);
	}, [quickStats]);

	return (
		<div className="min-w-full max-w-[100vw]">
			<Paper className="p-[16px] mt-[-5px] rounded-[4px]">
				{quickStats.length > 0 ? (
					<Formik
						enableReinitialize
						initialValues={initialValues}
						validationSchema={schema}
						onSubmit={(values) => {}}
					>
						{({ values }) => (
							<Form>
								<Grid
									container
									spacing={2}
									className="pt-[5px]"
								>
									{quickStats.map((item) => {
										const fieldName = item?.name;
										const fieldLabel = t(fieldName);
										const fieldValue = values[fieldName];

										return (
											<Grid
												item
												xl={2}
												lg={3}
												md={4}
												sm={6}
												xs={12}
												className="formikFormField pt-[5px!important]"
												key={item?.id}
											>
												{fieldValue !== undefined ? (
													<>
														<Typography>{fieldLabel}</Typography>
														<Field
															name={fieldName}
															id={fieldName}
															component={TextFormField}
															fullWidth
															disabled
															value={fieldValue}
														/>
													</>
												) : (
													<Typography
														variant="h6"
														color="error"
														className="text-[12px] sm:text-[14px] lg:text-[16px]"
													>
														No Stats available.
													</Typography>
												)}
											</Grid>
										);
									})}
								</Grid>
							</Form>
						)}
					</Formik>
				) : (
					<Typography
						variant="h6"
						color="error"
						className="text-[12px] sm:text-[14px] lg:text-[16px]"
					>
						No Stats available.
					</Typography>
				)}
			</Paper>
		</div>
	);
}

export default QuickStatusView;
