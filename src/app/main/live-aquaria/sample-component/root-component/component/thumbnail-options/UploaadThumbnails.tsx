import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
	deleteGeneralAdvertisementByID,
	uploadThumbnails
} from '../../../../../../axios/services/live-aquaria-services/general-advertisement-services/GeneralAdvertisementService';
import CommonHeading from '../../../../../../common/FormComponents/CommonHeading';
import { GeneralAdvMainObject, imageType, MediaModifyResponseData } from '../../types/general-advertisement-types';
import MediaDeleteAlertForm from '../MediaDeleteAlertForm';

const IOSSwitch = styled((props: SwitchProps) => (
	<Switch
		focusVisibleClassName=".Mui-focusVisible"
		disableRipple
		{...props}
	/>
))(({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	'& .MuiSwitch-switchBase': {
		padding: 0,
		margin: 2,
		transitionDuration: '300ms',
		'&.Mui-checked': {
			transform: 'translateX(16px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: theme.palette.mode === 'dark' ? '#cdcfe1' : '#387ed4',
				opacity: 1,
				border: 0
			}
		}
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 22,
		height: 22
	},
	'& .MuiSwitch-track': {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === 'light' ? '#cdcfe1' : '#387ed4',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 500
		})
	}
}));

interface Props {
	clickedRowData: GeneralAdvMainObject;
	isTableMode: string;
	fetchDataForProfileView: () => void;
	isMedia: MediaModifyResponseData;
}

function MainComponent({ clickedRowData, isTableMode, fetchDataForProfileView, isMedia }: Props) {
	const { t } = useTranslation('sampleComponent');
	const [images, setImages] = useState<{ id?: number; link?: string; file?: File; base64?: string }[]>([]);

	const [videos, setVideos] = useState<{ id?: number; link?: string; file?: File; base64?: string }[]>([]);

	const [videoLinks, setVideoLinks] = useState<string[]>([]);
	const [newVideoLink, setNewVideoLink] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSaveEnabled, setIsSaveEnabled] = useState(false);
	const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
	const [isProductSubmitDataLoading, setProductSubmitDataLoading] = useState(false);
	const maxImageCount = 2;
	const maxVideoCount = 1;
	const maxImageSize = 5 * 1024 * 1024; // 5MB
	const maxVideoSize = 30 * 1024 * 1024; // 30MB
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const [isMediaDeleteId, setMediaDeleteId] = useState<number>(null);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);
	const [isVideoLoading, setVideoLoading] = useState(false);
	const [isImageLoading, setImageLoading] = useState(false);

	useEffect(() => {
		if (isMedia.imagesIn) {
			loadImageById(isMedia.imagesIn);
		}

		if (isMedia.videoIn) {
			loadVideoById(isMedia.videoIn);
		}

		if (isMedia.video_link) {
			setUploadType('link');
			setNewVideoLink(isMedia.video_link);
		}
	}, [isMedia]);

	const loadImageById = async (imageData: imageType[]) => {
		setImageLoading(true);
		const loadedImages = await Promise.all(
			imageData.map(async (image) => {
				// Fetch the image to get the file
				const response = await fetch(image.link, { mode: 'no-cors' });
				const blob = await response.blob();
				const file = new File([blob], `image_${image.id}.png`, {
					type: blob.type
				});
				const base64 = await convertToBase64(file);
				return {
					id: image.id,
					link: image.link,
					file,
					base64
				};
			})
		);

		setImages(loadedImages);
		setImageLoading(false);
	};

	const loadVideoById = async (videoData: imageType[]) => {
		setVideoLoading(true);
		const loadedVideos = await Promise.all(
			videoData.map(async (video) => {
				// Fetch the video to get the file
				const response = await fetch(video.link);
				const blob = await response.blob();
				const file = new File([blob], `video_${video.id}.mp4`, {
					type: blob.type
				});
				const base64 = await convertToBase64(file);
				return {
					id: video.id,
					link: video.link,
					file,
					base64
				};
			})
		);

		setVideos(loadedVideos);
		setVideoLoading(false);
	};

	const validateImageDimensions = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				if (img.width === img.height && file.size <= maxImageSize) {
					resolve(true);
				} else {
					toast.error('Image upload failed: Width and height must be the same, and size should be <= 5MB.');
					resolve(false);
				}
			};
		});
	};

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				resolve(reader.result as string);
			};
			reader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;

		if (files) {
			if (images.length + files.length > maxImageCount) {
				toast.error(`You can only upload a maximum of ${maxImageCount} images.`);
				return;
			}

			const validImages: {
				id: number;
				link: string;
				file: File;
				base64: string;
			}[] = [];
			// eslint-disable-next-line no-restricted-syntax
			for (const file of Array.from(files)) {
				// eslint-disable-next-line no-await-in-loop
				const isValid = await validateImageDimensions(file);

				if (isValid) {
					// eslint-disable-next-line no-await-in-loop
					const base64 = await convertToBase64(file);
					validImages.push({
						id: Date.now(),
						link: URL.createObjectURL(file),
						file,
						base64
					});
				}
			}

			if (validImages.length > 0) {
				setImages((prevImages) => [...prevImages, ...validImages]);
				setIsSaveEnabled(true);
			}
		}
	};

	const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (videoLinks.length > 0) {
			toast.error('You cannot upload a video file while a video link is present.');
			return;
		}

		const { files } = event.target;

		if (files) {
			if (videos.length + files.length > maxVideoCount) {
				toast.error(`You can only upload a maximum of ${maxVideoCount} videos.`);
				return;
			}

			const newVideos = [];
			// eslint-disable-next-line no-restricted-syntax
			for (const file of Array.from(files)) {
				if (file.size > maxVideoSize) {
					toast.error(`Video upload failed: ${file.name} exceeds the 30MB size limit.`);
					// eslint-disable-next-line no-continue
					continue;
				}

				// eslint-disable-next-line no-await-in-loop
				const base64 = await convertToBase64(file);
				const videoLink = URL.createObjectURL(file);
				newVideos.push({
					id: Date.now(),
					link: videoLink,
					file,
					base64
				});
			}

			if (newVideos.length > 0) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
				setVideos((prevVideos) => [...prevVideos, ...newVideos]);
				setIsSaveEnabled(true);
			}
		}
	};

	const handleVideoLinkSubmit = () => {
		if (videos.length > 0) {
			toast.error('You cannot add a video link while video files are present.');
			return;
		}

		if (newVideoLink) {
			const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(newVideoLink);

			if (isValidUrl && videoLinks.length === 0) {
				setVideoLinks([newVideoLink]);
				setNewVideoLink('');
				setIsSaveEnabled(true);
			} else {
				toast.error('Invalid video URL or only one link allowed.');
			}
		}
	};

	const handleRemoveImage = (id: number) => {
		const doesExist = isMedia?.imagesIn?.some((mediaItem) => mediaItem?.id === id);

		if (doesExist) {
			toggleDeleteModal();
			setMediaDeleteId(id);
		} else {
			const newImages = images.filter((image) => image.id !== id);
			setImages(newImages);
			setIsSaveEnabled(newImages.length > 0 || videos.length > 0 || videoLinks.length > 0);
		}
	};

	const handleRemoveVideo = (id: number) => {
		const doesExist = isMedia?.videoIn?.some((mediaItem) => mediaItem?.id === id);

		if (doesExist) {
			toggleDeleteModal();
			setMediaDeleteId(id);
		} else {
			const newVideos = videos.filter((video) => video.id !== id);
			setVideos(newVideos);
			setIsSaveEnabled(images.length > 0 || newVideos.length > 0 || videoLinks.length > 0);
		}
	};

	const handleRemoveVideoLink = (index: number) => {
		const newLinks = videoLinks.filter((_, i) => i !== index);
		setVideoLinks(newLinks);
		setIsSaveEnabled(images.length > 0 || videos.length > 0 || newLinks.length > 0);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const filteredImages = images.filter(
			(image) => !isMedia?.imagesIn?.some((mediaItem) => mediaItem?.id === image?.id)
		);

		const filteredVideos = videos.filter(
			(video) => !isMedia?.videoIn?.some((mediaItem) => mediaItem?.id === video?.id)
		);

		const submitImages = filteredImages.map((image) => image.base64);
		const submitVideos = filteredVideos.map((video) => video.base64);

		const mediaData = {
			video_link: newVideoLink,
			images: submitImages,
			videos: submitVideos
		};

		const entityId = clickedRowData?.id;

		if (!entityId) {
			toast.error('General advertisement Id is required');
			setProductSubmitDataLoading(false);
			return;
		}

		setProductSubmitDataLoading(true);
		const message: string = isTableMode === 'edit' ? 'Updated successfully' : 'Created successfully';
		try {
			const response = await uploadThumbnails(entityId, mediaData);
			fetchDataForProfileView();
			setProductSubmitDataLoading(false);
			setIsSaveEnabled(false);
			toast.success(message);
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (error?.response && error?.response?.data?.message) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
				toast.error(error?.response?.data?.message);
			} else {
				toast.error('Internal server error');
			}

			setProductSubmitDataLoading(false);
			setIsSaveEnabled(false);
		}
	};

	const handleSwitchChange = () => {
		// Clear all fields when the switch is toggled
		setVideos([]);
		setVideoLinks([]);
		setNewVideoLink('');
		setUploadType(uploadType === 'file' ? 'link' : 'file');
	};

	const buttonClass = isSaveEnabled ? 'searchButton ml-auto' : 'resetButton';

	const deleteMedia = async () => {
		toggleDeleteModal();
		const entityId = clickedRowData?.id;
		try {
			const response = await deleteGeneralAdvertisementByID(entityId, isMediaDeleteId);
			fetchDataForProfileView();
			toast.success('Deleted successfully');
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (error?.response && error?.response?.data?.message) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
				toast.error(error?.response?.data?.message);
			} else {
				toast.error('Internal server error');
			}
		}
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<Paper className="p-[16px] mt-[-5px] rounded-[4px]">
				<form onSubmit={handleSubmit}>
					<Grid
						container
						spacing={2}
						className="pt-0"
					>
						<Grid
							item
							xs={12}
							sm={6}
							className="flex justify-end items-center gap-[10px] pt-[10px!important]"
						>
							<CommonHeading title="Upload Media" />
						</Grid>
						{/* Toggle between Uploading File or Adding Link */}
						<Grid
							item
							xs={12}
							sm={6}
							className="flex justify-end items-center gap-[10px] pt-[10px!important]"
						>
							<Typography className="text-[10px] sm:text-[12px] lg:text-[14px]">
								Add Video Link
							</Typography>
							<IOSSwitch
								checked={uploadType === 'file'}
								disabled={isTableMode === 'view'}
								onChange={handleSwitchChange}
								inputProps={{
									'aria-label': 'switch between video file and link'
								}}
							/>
							<Typography className="text-[10px] sm:text-[12px] lg:text-[14px]">
								Upload Video File
							</Typography>
						</Grid>

						{/* Image Upload Section */}
						{isImageLoading ? (
							<Grid
								item
								md={6}
								xs={12}
								className="flex justify-start items-center w-full min-h-[100px] pl-[25px]"
							>
								<CircularProgress className="text-primaryBlue" />
							</Grid>
						) : (
							<Grid
								item
								md={6}
								xs={12}
								className="formikFormField"
							>
								<h4 className="text-[10px] sm:text-[12px] lg:text-[14px] font-600 mb-[5px]">
									{t('UPLOAD_A_THUMBNAIL_IMAGE')}
								</h4>
								<div className="relative flex flex-wrap gap-[10px]">
									{images.map((image) => (
										<div
											key={image.id}
											className="relative w-[100px] h-[100px] m-[3px] border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
										>
											<img
												src={image.link}
												alt={`Thumbnail ${image.id}`}
												className="w-full h-full rounded-[10px] object-contain object-center"
											/>
											<IconButton
												disabled={isTableMode === 'view'}
												size="small"
												className="absolute top-0 right-0 text-white p-[2px] rounded-full bg-black/5 transition-colors duration-300 hover:text-red"
												onClick={() => handleRemoveImage(image.id)}
											>
												<CancelIcon fontSize="small" />
											</IconButton>
										</div>
									))}

									{images.length < maxImageCount && (
										<div className="relative flex justify-center items-center w-[100px] h-[100px] m-[3px] border-[2px] border-[#ccc] rounded-[10px]">
											<IconButton
												className="text-primaryBlue"
												disabled={isTableMode === 'view'}
												onClick={() => document.getElementById('imageUpload')?.click()}
											>
												<AddCircleIcon fontSize="large" />
											</IconButton>
											<input
												id="imageUpload"
												type="file"
												accept="image/*"
												style={{ display: 'none' }}
												multiple
												onChange={handleImageUpload}
											/>
										</div>
									)}
								</div>
								<span className="text-[10px] text-gray-700 italic">
									<b className="text-red">Note : </b>
									Image dimensions must be 1:1, and size ≤ 5MB.
								</span>
							</Grid>
						)}

						{/* Video Upload/Link Section */}
						{isVideoLoading ? (
							<Grid
								item
								md={6}
								xs={12}
								className="flex justify-start items-center w-full min-h-[100px] pl-[25px]"
							>
								<CircularProgress className="text-primaryBlue" />
							</Grid>
						) : (
							<Grid
								item
								md={6}
								xs={12}
								className="formikFormField"
							>
								<h4 className="text-[10px] sm:text-[12px] lg:text-[14px] font-600 mb-[5px]">
									{t('UPLOAD_AN_ADVERTISEMENT_VIDEO')}
								</h4>
								{uploadType === 'file' ? (
									<div className="relative flex flex-wrap gap-[10px]">
										{videos.map((video, index) => (
											<div
												key={video.id}
												className="relative w-[100px] h-[100px] m-[3px] border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
											>
												<video
													width="100%"
													height="100%"
													className="min-h-full object-cover object-center rounded-[10px]"
													muted
													controls
												>
													<source
														src={URL.createObjectURL(video.file)}
														type={video.file.type}
													/>
													Your browser does not support the video tag.
												</video>
												<IconButton
													disabled={isTableMode === 'view'}
													size="small"
													className="absolute top-0 right-0 text-white p-[2px] rounded-full bg-black/5 transition-colors duration-300 hover:text-red"
													onClick={() => handleRemoveVideo(video.id)}
												>
													<CancelIcon fontSize="small" />
												</IconButton>
											</div>
										))}
										{videos.length < maxVideoCount && (
											<div className="relative flex justify-center items-center w-[100px] h-[100px] m-[3px] border-[2px] border-[#ccc] rounded-[10px] overflow-hidden">
												<IconButton
													disabled={isTableMode === 'view'}
													className="text-primaryBlue"
													onClick={() => document.getElementById('videoUpload')?.click()}
												>
													<AddCircleIcon fontSize="large" />
												</IconButton>
												<input
													id="videoUpload"
													type="file"
													accept="video/*"
													style={{ display: 'none' }}
													multiple
													onChange={handleVideoUpload}
												/>
											</div>
										)}
									</div>
								) : (
									<div className="flex items-center">
										<TextField
											fullWidth
											value={newVideoLink}
											onChange={(e) => {
												const input = e.target.value;
												setNewVideoLink(input);
												setIsSaveEnabled(input.length > 0);
											}}
											variant="outlined"
											size="small"
											disabled={isTableMode === 'view'}
										/>
									</div>
								)}

								{/* Displaying video links */}
								{videoLinks.map((link, index) => (
									<div
										key={index}
										className="relative flex justify-center items-center w-full h-auto py-[4px] m-[3px] border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
									>
										<div className="w-full h-full text-center break-all">{link}</div>
										<IconButton
											disabled={isTableMode === 'view'}
											size="small"
											className="absolute top-0 right-0 text-white p-[2px] rounded-full bg-black/5 transition-colors duration-300 hover:text-red"
											onClick={() => handleRemoveVideoLink(index)}
										>
											<CancelIcon fontSize="small" />
										</IconButton>
									</div>
								))}
								<span className="text-[10px] text-gray-700 italic">
									{/* <b className='text-red'>Note : </b> */}
									{/* Video file size must be ≤ 10MB. */}
								</span>
							</Grid>
						)}

						{/* Save Button */}
						<Grid
							item
							md={12}
							sm={12}
							xs={12}
							className="flex justify-end items-center gap-[10px] pt-[10px!important]"
						>
							{isTableMode !== 'view' && (
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
									variant="contained"
									color="primary"
									disabled={false}
								>
									{isTableMode === 'edit' ? 'Update' : 'Save'}
									{isProductSubmitDataLoading ? (
										<CircularProgress
											className="text-white ml-[5px]"
											size={24}
										/>
									) : null}
								</Button>
							)}
						</Grid>
					</Grid>
				</form>
			</Paper>

			{isOpenDeleteModal && (
				<MediaDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					handleAlertForm={deleteMedia}
				/>
			)}
		</div>
	);
}

export default MainComponent;
