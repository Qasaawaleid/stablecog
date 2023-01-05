import type { Translation } from '../i18n-types';

const vi: Translation = {
	Language: 'Ngôn ngữ',
	Home: {
		GenerateButton: 'Khởi tạo',
		PromptInput: {
			Placeholder: 'Tranh chân dung một con mèo vẽ bởi Van Gogh'
		},
		WidthTabBar: {
			Title: 'Chiều rộng',
			Paragraph: 'Chiều rộng của hình ảnh.'
		},
		HeightTabBar: {
			Title: 'Chiều cao',
			Paragraph: 'Chiều cao của hình ảnh.'
		},
		InferenceStepsTabBar: {
			Title: 'Số bước suy luận',
			Paragraph: 'Bao nhiêu bước sẽ được thực hiện để tạo ra ảnh.'
		},
		GuidanceScaleSlider: {
			Title: 'Mức độ hướng dẫn',
			Paragraph:
				'Hình ảnh sẽ theo sát lời mô tả đến đâu. Giá trị cao hơn khiến hình ảnh dược tạo ra sát với lời mô tả hơn.'
		},
		NegativePromptInput: {
			Title: 'Mô tả nghịch đảo',
			Placeholder: 'Mô tả nghịch đảo',
			Paragraph:
				'Để xóa những thứ không mong muốn xuất hiện trong hình ảnh. Nó có tác dụng ngược so với lời mô tả.'
		},
		SeedInput: {
			Title: 'Số khởi tạo',
			Placeholder: 'Số khởi tạo',
			Paragraph:
				'Nhận được kết quả lặp lại giống nhau. Một số khởi tạo kết hợp với cùng một lời mô tả và các tùy chọn giống nhau sẽ tạo ra cùng một hình ảnh giống nhau.'
		},
		ModelDropdown: {
			Title: 'Mẫu',
			Paragraph: 'Kiểu mẫu AI sẽ được dùng để tạo hình ảnh.'
		},
		SchedulerDropdown: {
			Title: 'Bộ lấy mẫu',
			Paragraph:
				'Tạo ảnh theo từng cách nhất định. Dùng bộ lấy mẫu khác nhau sẽ thay đổi hình ảnh đáng kể. Có những bộ lấy mẫu cần ít bước suy luận hơn để cho ra hình ảnh tốt.'
		},
		SubmitToGalleryQuestion: {
			Title: 'Gửi hình ảnh tới thư viện công cộng?',
			Paragraph: 'Bạn có thể thay đổi thiết lập này sau trong phần cài đặt.'
		}
	},
	History: {
		GenerationsTitle: 'Các hình ảnh',
		GenerationsMaxSavedCountWarning: 'Chỉ hiện thị {count}',
		NoGenerationsYet: 'Bạn chưa tạo hình ảnh nào cả.'
	},
	Live: {
		GenerationsTitle: 'Số lượng hình ảnh',
		TotalDurationTitle: 'Tổng thời gian',
		UpscalesTitle: 'Số lệnh phóng to',
		GenerationTooltip: {
			CountryTitle: 'Quốc gia',
			Type: {
				Title: 'Kiểu',
				Generation: 'Tạo ảnh',
				Upscale: 'Phóng to'
			},
			DimensionsTitle: 'Kích thước',
			StepsTitle: 'Số bước',
			ScaleTitle: 'Tỉ lệ',
			DurationTitle: 'Thời gian',
			Status: {
				Title: 'Trạng thái',
				Started: 'Đã bắt đầu',
				Succeeded: 'Thành công',
				Failed: 'Thất bại'
			},
			Server: {
				Title: 'Máy chủ',
				Default: 'Mặc định',
				Custom: 'Tùy chỉnh'
			},
			UnknownTitle: 'Không xác định'
		},
		WaitingTitle: 'Chờ khởi tạo',
		DurationStatusUnknown: 'Không xác định'
	},
	Navbar: {
		HomeTab: 'Trang chủ',
		HistoryTab: 'Lịch sử',
		GalleryTab: 'Thư viện',
		LiveTab: 'Trực tiếp'
	},
	Settings: {
		Title: 'Cài đặt',
		SwitchServerButton: 'Đổi Máy chủ',
		SubmitToGalleryToggle: 'Lưu vào Thư viện',
		AdvancedModeToggle: 'Chế độ nâng cao',
		AdvancedOptionsDropdown: 'Tùy chọn nâng cao',
		AdvancedDropdown: 'Nâng cao',
		GenerationSettingsButton: 'Cài đặt chung',
		GenerationSettingsTitle: 'Cài đặt tạo ảnh',
		DarkModeToggle: 'Chế độ tối'
	},
	GenerationFullscreen: {
		DownloadButton: 'Tải về',
		DoneButtonState: 'Hoàn thành!',
		CopyPromptButton: 'Sao chép mô tả',
		CopyNegativePromptButton: 'Sao chép mô tả nghịch đảo',
		CopiedButtonState: 'Đã sao chép!',
		RerollButton: 'Tái tạo ngẫu nhiên',
		RegenerateButton: 'Tái tạo',
		GenerateButton: 'Khởi tạo',
		UpscaleButton: 'Phóng to',
		UpscaleTabBar: {
			UpscaledTitle: 'Phóng to',
			OriginalTitle: 'Nguyên bản'
		},
		Dimensions: {
			Title: 'Kích thước'
		},
		Duration: {
			Title: 'Thời gian'
		}
	},
	SetServerModal: {
		SetServerTitle: 'Nhập máy chủ',
		SwitchServerTitle: 'Đổi máy chủ',
		Paragraph: 'Máy chủ sẽ được dùng để tạo hình ảnh.',
		SetButton: 'Chọn',
		DefaultButton: 'Mặc định'
	},
	Blog: {
		Title: 'Bài đăng trên blog',
		TitleAlt: 'Nhật ký',
		BackToBlogButton: 'Quay lại nhật ký'
	},
	Redirect: {
		RedirectingToTitle: 'Đang chuyển hướng đến {name}'
	},
	Shared: {
		StartGeneratingTitle: 'Sẵn sàng tạo ra những bức ảnh đẹp đẽ!',
		StartGeneratingButton: 'Khởi tạo ảnh',
		JoinUsTitle: 'Gia nhập',
		GoHomeButton: 'Về trang chủ',
		SwitchToDefaultServerButton: 'Chuyển sang máy chủ mặc định',
		JoinUsOnTitle: 'Gia nhập tại {name}',
		ShareButton: 'Chia sẻ',
		ShareOnButton: 'Chia sẻ trên {name}',
		GoBackButton: 'Go Back',
		YesButton: 'Có',
		NoButton: 'Không',
		EnableButton: 'Cho phép',
		DisableButton: 'Vô hiệu hóa',
		AddButton: 'Thêm',
		CopyLinkButton: 'Sao chép liên kết',
		CopyButton: 'Sao chép',
		DeleteButton: 'Xóa',
		LoadingTitle: 'Đang tải',
		LoadingParagraph: 'Đang tải...',
		ServerUrlInput: {
			Placeholder: 'Đường dẫn máy chủ'
		},
		EmailInput: {
			Placeholder: 'Địa chỉ email'
		},
		PasswordInput: {
			Placeholder: 'Mật khẩu'
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stable Diffusion 1.5',
				simpleName: 'Tổng thể'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: 'Hình ảnh kỹ thuật số 3D'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: 'Truyện tranh 3D'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
				realName: 'Ghibli Diffusion',
				simpleName: 'Anime'
			},
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: 'Phim hoạt hình'
			},
			'eaa438e1-dbf9-48fd-be71-206f0f257617': {
				realName: 'Redshift Diffusion',
				simpleName: '3D Render'
			}
		},
		SchedulerOptions: {
			'55027f8b-f046-4e71-bc51-53d5448661e0': {
				realName: 'LMS'
			},
			'6fb13b76-9900-4fa4-abf8-8f843e034a7f': {
				realName: 'Euler'
			},
			'af2679a4-dbbb-4950-8c06-c3bb15416ef6': {
				realName: 'Euler A.'
			}
		},
		UnknownTitle: 'Không xác định',
		MoreOptionsTitle: 'Tuỳ chọn khác',
		LessOptionsTitle: 'Tùy chọn ít hơn',
		TryAgainButton: 'Thử lại'
	},
	Error: {
		SomethingWentWrong: 'Đã xảy ra lỗi :(',
		NSFW: 'Phát hiện nội dung không lành mạnh, hãy viết lời mô tả khác :(',
		ServerSeemsOffline:
			'Máy chủ có lẽ ngoại tuyến. Bạn thử F5 hoặc chọn máy chủ khác trong phần cài đặt.',
		ServerSetNotWorking: 'Máy chủ này không tương thích hoặc không phản hồi.',
		NotFound: 'Không tìm thấy',
		SupabaseNotFoundCantListen:
			'Không tìm thấy phiên Supabase. Không thể nhận được các lệnh khởi tạo.',
		InvalidEmail: 'Nhập địa chỉ email hợp lệ.',
		PasswordTooShort: 'Mật khẩu phải có ít nhất 8 ký tự.',
		SomethingWentWrongTryAgain: 'Có sự cố. Xin vui lòng thử lại.',
		InvalidCredentials: 'Thông tin dùng để xác thực không hợp lệ.',
		InvalidCode: 'Mã không hợp lệ.',
		OnceEvery60Seconds: 'You can only request a link once every 60 seconds.'
	},
	Admin: {
		AdminPanelTitle: 'Quản trị',
		DeleteButton: 'Xóa',
		ApproveButton: 'Phê duyệt',
		NoGenerationsToReview: 'Chưa có ảnh để duyệt.',
		ServersButton: 'Máy chủ',
		AdminGalleryButton: 'Thư viện',
		UsersButton: 'Người dùng',
		AdminTab: 'Quản trị',
		ServersTab: 'Máy chủ',
		AdminGalleryTab: 'Thư viện',
		UsersTab: 'Người dùng',
		Gallery: {
			TotalTitle: 'Tổng',
			ApprovedTitle: 'Đã duyệt',
			DeletedTitle: 'Đã xóa'
		}
	},
	SignUp: {
		PageTitle: 'Đăng ký',
		PageParagraph:
			'Tham gia và trở thành người dùng trả phí để khai mở hết tiềm năng của Stablecog.',
		PageTitleConfirm: 'Xác nhận',
		PageTitleConfirmAlt: 'Kiểm tra Email của bạn',
		PageParagraphConfirm:
			'Chúng tôi đã gửi cho bạn mã gồm 6 chữ số qua email. Nhập nó phía dưới để xác nhận tài khoản.',
		SignUpButton: 'Đăng ký',
		ConfirmButton: 'Xác nhận',
		AlreadyHaveAnAccountTitle: 'Đã có một tài khoản?',
		LoginInsteadButton: 'Đăng Nhập',
		SixDigitCodeInput: {
			Placeholder: 'Mã 6 chữ số'
		}
	},
	SignIn: {
		PageTitle: 'Đăng nhập',
		PageParagraph:
			'Bắt đầu dùng Stablecog với tất cả các tính năng sẵn có trong tài khoản của bạn.',
		PageTitleCreateAccountOrSignIn: 'Create an account or sign in',
		PageParagraphCreateAccountOrSignIn:
			'Start using Stablecog with all features that are available to your account.',
		PageTitleSentLink: 'Check your email',
		PageParagraphSentLink:
			"We've emailed you a sign-in link. If you don't see it, check your spam folder.",
		ContinueButton: 'Continue',
		ContinueWithProviderButton: 'Continue with {provider}',
		OrContinueWithEmailTitle: 'Or continue with email',
		DontHaveAnAccountTitle: 'Bạn không có tài khoản?',
		SignUpInsteadButton: 'Đăng ký mới',
		SignInButton: 'Đăng nhập',
		SignOutButton: 'Đăng xuất'
	},
	Pro: {
		PageTitle: 'Trở thành người dùng trả phí',
		PageParagraph:
			'Mở khóa tất cả các tính năng của Stablecog và hỗ trợ dự án. Nếu không có các thành viên trả phí, Stablecog sẽ không thể duy trì nguồn mở hoàn toàn và tiếp tục miễn phí cho mọi người.',
		PageTitleAlreadyPro: 'Đã là người dùng trả phí!',
		PageParagraphAlreadyPro:
			'Bạn đã là thành viên trả phí. Cảm ơn bạn đã ủng hộ dự án! Hãy tận hưởng Stablecog và chia sẻ với bạn bè của bạn.',
		ProPlanTitle: 'Trả phí',
		Features: {
			FullSpeed: 'Tốc độ đầy đủ không giới hạn',
			ImageDimensions: 'Đa dạng kích thước ảnh',
			Upscale: 'Phóng to ảnh',
			Steps: 'Đa dạng số bước suy luận',
			MoreModels: 'Nhiều mẫu (mô hình AI) hơn',
			MoreSchedulers: 'Nhiều bộ lấy mẫu hơn',
			SavedToCloud: 'Ảnh tạo ra được lưu lên mây',
			Upcoming: 'Các tính năng sắp xuất hiện',
			CommercialUse: 'Thương mại'
		},
		Soon: '(sắp có)',
		Month: '/tháng',
		BecomeProButton: 'Trở thành người dùng trả phí',
		Success: {
			PageTitle: 'Bạn là người dùng trả phí!',
			PageParagraph:
				'Bây giờ bạn có quyền truy cập vào mọi thứ mà Stablecog cung cấp. Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi tại {platform}.'
		},
		Cancel: {
			PageTitle: 'Bạn đã hủy bỏ',
			PageParagraph: 'Bạn đã hủy quá trình đăng ký. Nếu đó là một nhẫm lẫn, bạn hãy thử lại.'
		},
		Reason: {
			ParagraphWidth: 'Chế độ miễn phí không hỗ trợ kích thước chiều rộng này.',
			ParagraphHeight: 'Chế độ miễn phí không hỗ trợ kích thước chiều cao này.',
			ParagraphDimensions: 'Chế độ miễn phí không hỗ trợ kích thước hình ảnh này.',
			ParagraphUpscale: 'Chế độ miễn phí không hỗ trợ chức năng phóng to.',
			ParagraphInferenceSteps: 'Chế độ miễn phí không hỗ trợ số bước suy luận này.',
			ParagraphModel: 'Chế độ miễn phí không hỗ trợ mô hình AI này.',
			ParagraphScheduler: 'Chế độ miễn phí không hỗ trợ bộ lấy mẫu này.',
			ParagraphWidthGeneration:
				'Chế độ miễn phí không hỗ trợ kích thước chiều rộng mà hình ảnh này được khởi tạo.',
			ParagraphHeightGeneration:
				'Chế độ miễn phí không hỗ trợ kích thước chiều cao mà hình ảnh này được khởi tạo.',
			ParagraphDimensionsGeneration:
				'Chế độ miễn phí không hỗ trợ kích thước mà hình ảnh này được khởi tạo.',
			ParagraphInferenceStepsGeneration:
				'Chế độ miễn phí không hỗ trợ số bước suy luận mà hình ảnh này được khởi tạo.',
			ParagraphModelGeneration:
				'Chế độ miễn phí không hỗ trợ mô hình AI đã dùng để khởi tạo hình ảnh này.',
			ParagraphSchedulerGeneration:
				'Chế độ miễn phí không hỗ trợ số bước suy luận đã dùng để khởi tạo hình ảnh này.'
		},
		Tier: {
			Title: {
				Free: 'Miễn phí',
				Pro: 'Trả phí'
			},
			Badge: {
				Free: 'MIỄN PHÍ',
				Pro: 'TRẢ PHÍ'
			}
		}
	},
	Account: {
		PageTitle: 'Tài khoản',
		ManageSubscriptionButton: 'Quản lý gói đăng ký',
		ManageAccountButton: 'Quản lý tài khoản',
		MyAccountButton: 'Tài khoản của tôi',
		SubscriptionPlanTitle: 'Gói'
	},
	ForgotPassword: {
		PageTitle: 'Đặt lại mật khẩu',
		PageParagraph: 'Chúng tôi sẽ gửi mã số gồm 6 chữ số đến email của bạn để đặt lại mật khẩu.',
		SendResetCodeButton: 'Gửi mã',
		PageTitleConfirmCode: 'Xác nhận',
		PageTitleConfirmCodeAlt: 'Kiểm tra Email của bạn',
		PageParagraphConfirmCode:
			'Chúng tối đã gửi bạn mã số gồm 6 chữ số qua email. Nhập nó phía dưới để tiếp tục.',
		ConfirmCodeButton: 'Xác nhận',
		PageTitleNewPassword: 'Mật khẩu mới',
		PageParagraphNewPassword: 'Nhập mật khẩu mới cho tài khoản của bạn.',
		NewPasswordInput: {
			Placeholder: 'Mật khẩu mới'
		},
		SetNewPasswordButton: 'Đặt mật khẩu mới',
		PageTitleSuccess: 'Hoàn thành!',
		PageParagraphSuccess: 'Mật khẩu đã được đặt lại thành công.',
		ForgotPasswordButton: 'Quân mật khẩu?'
	},
	FeaturedOn: {
		PageTitle: 'Chúng tôi nổi bật trên'
	},
	Gallery: {
		PageTitle: 'Gallery',
		PageParagraph: 'Check out what others have created with Stablecog.',
		SearchInput: {
			Title: 'Search'
		},
		SearchingTitle: 'Searching',
		NoMatchingGenerationTitle: 'No matching generation'
	}
};
export default vi;
