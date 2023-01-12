import type { Translation } from '../i18n-types';

const ja: Translation = {
	Language: '言語',
	Home: {
		GenerateButton: '生成',
		PromptInput: {
			Placeholder: 'ファン・ゴッホによる猫像'
		},
		WidthTabBar: {
			Title: '幅',
			Paragraph: '画像の幅。'
		},
		HeightTabBar: {
			Title: '高さ',
			Paragraph: '画像の高さ。'
		},
		InferenceStepsTabBar: {
			Title: '推論ステップ',
			Paragraph: '画像の生成(拡散)に必要なステップ数。'
		},
		GuidanceScaleSlider: {
			Title: 'ガイダンススケール',
			Paragraph:
				'生成画像がプロンプトにどれほど近似するかを指定します。値が高いほど、画像がプロンプトにより近似することを意味します。'
		},
		NegativePromptInput: {
			Title: '負のプロンプト',
			Placeholder: '負のプロンプト',
			Paragraph:
				'生成画像から除去したいもの指定します。プロンプトとは対照的な意味としてとらわれます。'
		},
		SeedInput: {
			Title: 'シード値',
			Placeholder: 'シード値',
			Paragraph:
				'再現性のある結果を可能とします。固定されたシード数とプロンプトを組み合わせると、毎回同じ画像が生成されます。'
		},
		ModelDropdown: {
			Title: 'モデル',
			Paragraph: '画像生成するために使用されるAIモデル。'
		},
		SchedulerDropdown: {
			Title: 'スケジュラー',
			Paragraph:
				'特定の方法で画像を拡散します。生成された画像を大幅に変更することができます。スケジュラーによっては、任意の結果を生み出すために必要なステップ数が少ない場合があります。'
		},
		SubmitToGalleryQuestion: {
			Title: '生成された画像をギャラリーに提出しますか?',
			Paragraph: '後で設定から任意に変更できます。'
		}
	},
	History: {
		GenerationsTitle: '生成画像',
		GenerationsMaxSavedCountWarning: '最新の {count} のみ',
		NoGenerationsYet: 'まだ画像を生成していません。'
	},
	Live: {
		GenerationsTitle: '生成数',
		TotalDurationTitle: '合計所用時間',
		UpscalesTitle: 'アップスケール数',
		GenerationTooltip: {
			CountryTitle: '国',
			Type: {
				Title: '種類',
				Generation: '生成画像',
				Upscale: 'アップスケール'
			},
			DimensionsTitle: '寸法',
			StepsTitle: 'ステップ',
			ScaleTitle: 'スケール',
			DurationTitle: '所用時間',
			Status: {
				Title: 'ステータス',
				Started: '開始済み',
				Succeeded: '成功',
				Failed: '失敗'
			},
			Server: {
				Title: 'サーバ',
				Default: '既定値',
				Custom: 'カスタム設定'
			},
			UnknownTitle: '不明'
		},
		WaitingTitle: '生成待機中',
		DurationStatusUnknown: '不明'
	},
	Navbar: {
		HomeTab: 'ホーム',
		HistoryTab: '履歴',
		GalleryTab: 'ギャラリー',
		LiveTab: 'ライブ'
	},
	Settings: {
		Title: '設定',
		SwitchServerButton: 'サーバーを切り替え',
		SubmitToGalleryToggle: 'ギャラリーに提出',
		AdvancedModeToggle: '高度なモード',
		AdvancedOptionsDropdown: '高度なオプション',
		AdvancedDropdown: '高度な設定',
		GenerationSettingsButton: '生成設定',
		GenerationSettingsTitle: '生成設定',
		DarkModeToggle: 'ダークモード'
	},
	GenerationFullscreen: {
		DownloadButton: 'ダウンロード',
		DoneButtonState: '完了！',
		CopyPromptButton: 'プロンプトをコピー',
		CopyNegativePromptButton: '負のプロンプトをコピー',
		CopiedButtonState: 'コピー済',
		RerollButton: 'リロール',
		RegenerateButton: '再生成',
		GenerateButton: '生成',
		UpscaleButton: 'アップスケール',
		UpscaleTabBar: {
			UpscaledTitle: 'アップスケール済',
			OriginalTitle: 'オリジナル'
		},
		Dimensions: {
			Title: '寸法'
		},
		Duration: {
			Title: '所用時間'
		}
	},
	SetServerModal: {
		SetServerTitle: 'サーバー設定',
		SwitchServerTitle: 'サーバーの切り替え',
		Paragraph: 'サーバーは画像の生成に使用されます。',
		SetButton: '設定',
		DefaultButton: '既定値'
	},
	Blog: {
		Title: 'ブログの投稿',
		TitleAlt: 'ブログ',
		BackToBlogButton: 'ブログに戻る'
	},
	Redirect: {
		RedirectingToTitle: '{name} に転送'
	},
	Shared: {
		StartGeneratingTitle: '美しい画像を生成し始めよう!',
		StartGeneratingButton: '生成を開始',
		JoinUsTitle: '今すぐ参加',
		GoHomeButton: 'ホームに戻る',
		SwitchToDefaultServerButton: 'デフォルトのサーバーに切り替える',
		JoinUsOnTitle: '{name} にて参加してください',
		ShareButton: '共有',
		ShareOnButton: '{name} にて共有',
		GoBackButton: '戻る',
		YesButton: 'はい',
		NoButton: 'いいえ',
		EnableButton: '有効にする',
		DisableButton: '無効にする',
		AddButton: '追加',
		CopyLinkButton: 'リンクをコピー',
		CopyButton: 'コピー',
		DeleteButton: '削除',
		LoadingTitle: '読み込み中',
		LoadingParagraph: '読み込み中...',
		ServerUrlInput: {
			Placeholder: 'サーバ URL'
		},
		EmailInput: {
			Placeholder: 'メールアドレス'
		},
		PasswordInput: {
			Placeholder: 'パスワード'
		},
		ModelOptions: {
			'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
				realName: 'Stable Diffusion 1.5',
				simpleName: '一般'
			},
			'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
				realName: 'Openjourney',
				simpleName: '3Dデジタルアート'
			},
			'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
				realName: 'Arcane Diffusion',
				simpleName: '3Dコミック'
			},
			'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
				realName: 'Ghibli Diffusion',
				simpleName: 'アニメ2'
			},
			'790c80e1-65b1-4556-9332-196344389572': {
				realName: 'Mo-Di Diffusion',
				simpleName: 'アニメ動画'
			},
			'eaa438e1-dbf9-48fd-be71-206f0f257617': {
				realName: 'Redshift Diffusion',
				simpleName: '3Dレンダー'
			},
			'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9': {
				realName: 'Waifu Diffusion v1.4',
				simpleName: 'アニメ'
			},
			'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': {
				realName: '22h Diffusion v0.1',
				simpleName: 'アーティスティック'
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
			},
			'efee957a-dea5-48b2-a66a-1990dc2265c5': {
				realName: 'Heun'
			},
			'9d175114-9a26-4371-861c-729ba9ecb4da': {
				realName: 'DPM'
			},
			'7e98751f-e135-4206-b855-48b141e7b98f': {
				realName: 'DPM Singlestep'
			}
		},
		UnknownTitle: '不明',
		MoreOptionsTitle: 'オプションを表示',
		LessOptionsTitle: 'オプションを隠す',
		TryAgainButton: '再試行'
	},
	Error: {
		SomethingWentWrong: '不具合が発生しました。',
		NSFW: 'NSFW (閲覧注意) コンテンツが検出されました。別のプロンプトを試してください ☹️',
		ServerSeemsOffline:
			'サーバーはオフラインの様です。ページを更新するか、設定から別のサーバーを設定してください。',
		ServerSetNotWorking: 'このサーバーは互換性がないか、応答していません。',
		NotFound: '見つかりませんでした',
		SupabaseNotFoundCantListen:
			'Supabase インスタンスが見つからないため、生成への応答には利用できません。',
		InvalidEmail: '有効なメールアドレスを入力してください。',
		PasswordTooShort: 'パスワードは8文字以上でなければなりません。',
		SomethingWentWrongTryAgain: 'エラーが発生しました。再試行してください。',
		InvalidCredentials: '不正な認証情報',
		InvalidCode: 'コードが無効です。',
		OnceEvery60Seconds: 'リンクは60秒ごとに1回しかリクエストできません。'
	},
	Admin: {
		AdminPanelTitle: 'アドミ',
		DeleteButton: '削除',
		ApproveButton: '承認',
		NoGenerationsToReview: 'レビューする生成がありません。',
		ServersButton: 'サーバ',
		AdminGalleryButton: 'ギャラリー',
		UsersButton: 'ユーザー',
		AdminTab: 'アドミ',
		ServersTab: 'サーバ',
		AdminGalleryTab: 'ギャラリー',
		UsersTab: 'ユーザー',
		Gallery: {
			TotalTitle: '合計',
			ApprovedTitle: '承認済',
			DeletedTitle: '削除済'
		}
	},
	SignUp: {
		PageTitle: '新規登録',
		PageParagraph: 'Stablecogに参加してプロメンバーになり、その可能性を最大限に引き出しましょう。',
		PageTitleConfirm: '確認',
		PageTitleConfirmAlt: 'メールをチェックしてください',
		PageParagraphConfirm:
			'6桁のコードをメールで送信しました。アカウントを確認するには以下に入力してください。',
		SignUpButton: '新規登録',
		ConfirmButton: '確認',
		AlreadyHaveAnAccountTitle: '既にアカウントをお持ちですか？',
		LoginInsteadButton: '代わりにログインする',
		SixDigitCodeInput: {
			Placeholder: '6 桁のコード'
		}
	},
	SignIn: {
		PageTitle: 'サインイン',
		PageParagraph: 'あなたのアカウントで利用可能なすべての機能でStablecogを利用しよう！',
		PageTitleCreateAccountOrSignIn: 'アカウントの作成またはサインイン',
		PageParagraphCreateAccountOrSignIn:
			'アカウントで利用可能な全ての機能でStablecogを利用しましょう。',
		PageTitleSentLink: 'メールを確認してください',
		PageParagraphSentLink:
			'サインインリンクをメールで送信しました。見つからない場合は、迷惑メールフォルダを確認してください。',
		ContinueButton: '次へ進む',
		ContinueWithProviderButton: '{provider} で続行',
		SignInWithProviderButton: '{provider} でサインイン',
		OrContinueWithEmailTitle: 'またはメールで続ける',
		DontHaveAnAccountTitle: 'アカウントをお持ちでないですか？',
		SignUpInsteadButton: '代わりにサインアップする',
		SignInButton: 'サインイン',
		SignOutButton: 'サインアウト'
	},
	Pro: {
		PageTitle: 'Pro版に登録',
		PageParagraph:
			'Stablecogの全ての機能のアンロックする事が、プロジェクトの援助となります。引き続きStablecogを完全にオープンソースとして無料の生成を提供することが可能なのは、プロメンバーの皆様のおかげであると感謝しております。',
		PageTitleAlreadyPro: '既にPro版に登録済です!',
		PageParagraphAlreadyPro:
			'あなたはすでにPro版のメンバーです。当プロジェクトをサポートしていただき誠に有難うございます！是非Stablecogを楽しんで、友達と共有してください。',
		ProPlanTitle: 'プロ',
		Features: {
			FullSpeed: '制限なしのフルスピード',
			ImageDimensions: '任意の画像寸法',
			Upscale: '画像のアップスケーリング',
			Steps: '様々な推論ステップ',
			MoreModels: 'より多くのモデル',
			MoreSchedulers: 'より多くのスケジュラー',
			SavedToCloud: '生成画像をクラウドに保存',
			Upcoming: '今後追加される機能',
			CommercialUse: '商用利用'
		},
		Soon: '(近日中)',
		Month: '/ 月',
		BecomeProButton: 'Pro版に登録',
		Success: {
			PageTitle: 'プロ版にアップグレードしました!',
			PageParagraph:
				'Stablecogが提供するすべての機能にアクセスできます。ご質問があれば、 {platform} までお問い合わせください。'
		},
		Cancel: {
			PageTitle: 'キャンセルされました',
			PageParagraph:
				'サブスクリプションの処理がキャンセルされました。間違いであった場合は、もう一度やり直してください。'
		},
		Reason: {
			ParagraphWidth: 'その画像の幅は無料プランでは利用できません。',
			ParagraphHeight: 'その画像の高さは無料プランでは利用できません。',
			ParagraphDimensions: 'これらの画像寸法は無料プランでは利用できません。',
			ParagraphUpscale: 'アップスケール機能は無料プランでは利用できません。',
			ParagraphInferenceSteps: 'この推論ステップの設定は無料プランでは利用できません。',
			ParagraphModel: 'このAIモデルは無料プランでは利用できません。',
			ParagraphScheduler: 'このスケジュラーは無料プランでは利用できません。',
			ParagraphWidthGeneration:
				'その生成は、無料プランでは利用できない画像幅を使用して作成されました。',
			ParagraphHeightGeneration:
				'その生成は、無料プランでは利用できない画像の高さを使用して作成されました。',
			ParagraphDimensionsGeneration:
				'その生成は、無料プランでは利用できない画像寸法を使用して作成されました。',
			ParagraphInferenceStepsGeneration:
				'その生成は、無料プランでは利用できない推論ステップ設定を使用して作成されました。',
			ParagraphModelGeneration:
				'その世代は、無料プランでは利用できないAIモデルを使用して作成されました。',
			ParagraphSchedulerGeneration:
				'その生成は、無料プランでは利用できないスケジュラーを使用して作成されました。'
		},
		Tier: {
			Title: {
				Free: '無料',
				Pro: 'Pro'
			},
			Badge: {
				Free: '無料',
				Pro: 'PRO'
			}
		}
	},
	Account: {
		PageTitle: 'アカウント',
		ManageSubscriptionButton: 'サブスクリプションを管理',
		ManageAccountButton: 'アカウントを管理',
		MyAccountButton: 'アカウント',
		SubscriptionPlanTitle: 'プラン'
	},
	ForgotPassword: {
		PageTitle: 'パスワードのリセット',
		PageParagraph: 'パスワードをリセットするための6桁のコードをメールで送信します。',
		SendResetCodeButton: 'コードを送信',
		PageTitleConfirmCode: '確認する',
		PageTitleConfirmCodeAlt: 'メールを確認してください',
		PageParagraphConfirmCode:
			'6桁のコードをメールで送信しました。続行するには以下に入力してください。',
		ConfirmCodeButton: '確認',
		PageTitleNewPassword: '新しいパスワード',
		PageParagraphNewPassword: 'アカウントの新しいパスワードを入力してください。',
		NewPasswordInput: {
			Placeholder: '新しいパスワード'
		},
		SetNewPasswordButton: '新しいパスワードを設定',
		PageTitleSuccess: '完了！',
		PageParagraphSuccess: 'パスワードが正常にリセットされました。',
		ForgotPasswordButton: 'パスワードをお忘れですか？'
	},
	FeaturedOn: {
		PageTitle: '私たちは以下で紹介されています'
	},
	Gallery: {
		PageTitle: 'ギャラリー',
		PageParagraph: 'Stablecogで他の人が作成したものをご覧ください。',
		SearchInput: {
			Title: '検索'
		},
		SearchingTitle: '検索中...',
		NoMatchingGenerationTitle: '一致する生成がありません'
	}
};
export default ja;
