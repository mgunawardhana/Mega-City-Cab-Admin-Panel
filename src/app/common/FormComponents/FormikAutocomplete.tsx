// import {fieldToTextField} from 'formik-material-ui';
// import {getIn} from 'formik';
// import formComponentsStyles from "../css/UserStyles";
// import customTheme from "../css/custom-theme.module.css";
// import Paper from "@mui/material/Paper";
// import FormControl from "@mui/material/FormControl";
// import FormHelperText from "@mui/material/FormHelperText";
// import TextField from "@mui/material/TextField";
// import {Autocomplete} from "@mui/material";
//
// const FormikAutocomplete = (props: any) => {
//
// 	const {textfieldprops, options, form, label, required} = props;
// 	const {error, helperText, ...field} = fieldToTextField(props);
// 	const {name, value} = field;
// 	const classes = formComponentsStyles();
//
// 	const errorText = getIn(form.touched, name ? name : "") && getIn(form.errors, name ? name : "");
//
// 	const getLabel = (value: number): string => {
// 		for (let option of options) {
// 			if (parseInt(option.value) === value) {
// 				return String(option.label);
// 			}
// 		}
// 		return "";
// 	}
//
// 	const getLabelString = (value: string): string => {
// 		for (let option of options) {
// 			if (option.value == value) {
// 				return String(option.label);
// 			}
// 		}
// 		return "";
// 	}
//
// 	return (<FormControl size='small' fullWidth error={!!errorText} className={`${classes.formSelectors}`}>
// 		<Autocomplete
// 			PaperComponent={({children}) => (<Paper
// 				className={`${customTheme.autocompleteDropdown}`}
// 			>{children}</Paper>)}
// 			className={`${customTheme.autocompleteContent}`}
// 			style={{color: '#5e5e5e', backgroundColor: '#e4e6eb'}}
// 			size="small"
// 			options={options}
// 			value={value ? {
// 				value: value, label: typeof value == 'number' ? getLabel(value as any) : getLabelString(value as string)
// 			} : null}
// 			onChange={(_, value: any) => form.setFieldValue(name, value ? value.value : 0)}
// 			getOptionLabel={(option: any) => option.label}
//
// 			{...props}
// 			renderInput={props => (<TextField {...props} {...textfieldprops} label={label + (required ? ' *' : '')} InputLabelProps={{ style: { fontSize: '12px' } }}/>)}
// 			getOptionSelected={(option, value) => option.value === value.value}
// 		/>
// 		<FormHelperText style={{fontSize: '10px', fontWeight: 400}}>{errorText}</FormHelperText>
// 	</FormControl>);
//
//
// }
//
// export default React.memo(FormikAutocomplete);
