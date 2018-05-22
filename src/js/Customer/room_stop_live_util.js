var stop_reason_util = new function() {
	//优化建议
	this.scam_cn = {
			"0": "请注意直播过程中的灯光问题，将室内灯光打开，避免造成面部阴影。",
			"1": "请注意直播过程中的镜头感，建议人像在视频中的位置为腰部以上。",
			"2": "直播过程中请勿长时间离开直播画面，长时间离开会流失房间用户。",
			"3": "请注意你的着装，化妆。在视频中呈现一个漂亮美丽的自己。",
			"4": "直播过程中请勿长时间离开直播画面，长时间离开会流失房间用户。",
			"5": "请注意直播过程中与用户的互动，更多的互动会为你带来更多用户支持。",
			"6": "严禁在直播期间长时间接电话、玩手机",
			"7": "请注意直播过程中的背景，请丰富背景，建议摆放一些玩具，书籍。",
			"8": "直播已经被停了，因为严禁使用或转播他人视频，禁止挂录像，图片，需本人主持，禁止替播",
			"9": "请注意你的麦克风摆放位置，不要遮挡自己的面部。",
			"10": "直播过程中请检查你的麦克风，避免出现爆音，杂音，影响用户体验",
			"11": "你直播已经被停了，因为你忽视admen的信息",
			"12": "你直播已经被停了，因为你直播的时候在躺床",
			"13": "直播过程中不要覆盖屏幕",
			"14": "直播开始前需要确保设备正常，网络环境可满足直播条件"
		};
	this.scam_ar = {
			"0": "انتبه ! الرجاء الاهتمام بالإضاءة المناسبة داخل مكان البث بحيث لاتحجب الإضاءة وجه المضيف .",
			"1": "انتبه ! الرجاء وضع الكاميرا بشكل مناسب ليظهر الجزء العلوي من جسم المضيف من الرأس وحتى الخصر إن كنت تبث عن طريق الكمبيوتر ، أو أن يظهر الوجه كاملاً على أقل تقدير في حالة البث عن طريق الموبايل . ",
			"2": "انتبه ! الرجاء عدم ترك البث لأكثر من بضع دقائق أثناء البث ، فذلك يؤدي إلى مغادرة المستخدمين الاستوديو .",
			"3": "انتبه ! الرجاء الاهتمام بالمظهر الشخصي ، حاول أن تظهر نفسك في أحسن صورة أثناء البث .",
			"4": "انتبه ! الرجاء التأكد من كافة المعدات قبل البدء بالبث ، والتأكد من شبكة الإنترنت لتجنب ظهور الشاشة سوداء أمام المستخدمين .",
			"5": "انتبه ! الرجاء الاهتمام بالتفاعل مع المستخدمين ، فالتفاعل الأكثر مع المستخدمين يجلب لك الكثير من الدعم والتشجيع ! وتذكير المستخدمين بمتابعتك وإرسال الهدايا لك .",
			"6": "انتبه ! يمنع الإلتهاء بالهاتف أو إجراء المكالمات لفترات طويلة أثناء البث . ",
			"7": "انتبه ! الرجاء الاهتمام بشكل الخلفية  ، و وضع المسلتزمات المناسبة للزينة لها مثل : الكتب - الأدوات الترفيهية - الآلات الموسيقية - ألعاب و غيرها ...",
			"8": "انتبه ! تم قطع بثك لإنك قمت بعرض بعض الصور و الموسيقى  والفيديوهات لعدة دقائق وقمت بمغادرة الاستوديو أثناء البث المباشر بهدف المراوغة وتمرير الوقت. ",
			"9": "انتبه ! الرجاء الاهتمام بوضعية المايك ، ووضعه بالمكان المناسب بحيث لا يحجب وجه المضيف .",
			"10": "انتبه ! الرجاء فحص المايك باستمرار لتجنب تعطله أثناء البث فيصدر صوت ضوضاء أو ضجيج يؤثر على إستمتاع المستخدمين بالعرض .",
			"11": "انتبه ! تم قطع البث بسبب تجاهلك لتعليمات أدمن الادارة . ",
			"12": "انتبه ! يُمنع  نهائياً الإستلقاء على السرير أثناء البث المباشر .",
			"13": "انتبه ! يُمنع تغطية الكاميرا وعدم ظهور المضيف أثناء البث المباشر . ",
			"14": "انتبه ! قبل البدء بالبث ، الرجاء التأكد من سلامة وفاعلية معدات البث ، والتأكد من شبكة الإنترنت ومدى تلبيتها لشروط البث . "
		};
	this.scam_tr = {
			"0" : "Lütfen odanızdaki ışıkların açık olduğundan emin olun, karanlık bir ortamda yayın yapmayın!",
			"1" : "Kameranızın kaliteli bir çekim yaptığından emin olun, ayrıca kamerayı koyduğunuz pozisyonu iyi ayarlayın!",
			"2" : "Yayını uzun süreli terk etmeyin, kullanıcılarınız sıkılıp yayından çıkabilir!",
			"3" : "Dış görünümünüze dikkat edin, güzel ve özenli giyinin!",
			"4" : "Yayın için gerekli olan ekipmanları ve internetinizi önceden hazır hale getirin!",
			"5" : "Kullanıcılarla karşılıklı iyi bir etkileşim kurmaya dikkat edin. Unutmayın ki iyi iletişim daha fazla kullanıcı ve daha fazla takipçi demektir.",
			"6" : "Yayın esnasında uzun süre telefonla konuşmak veya telefonla oynamak yasaktır!",
			"7" : "Yayına başlamadan önce arka planınızı ayarlayın. Estetik bir dekorasyon oluşturmaya gayret edin!",
			"8" : "Sadece yayın saatlerini doldurmak amacıyla, kamera karşısında bulunmadan, uzun süreli film veya video koymamaya dikkat edin!",
			"9" : "Mikrofonun, yüzünüzü kapatmadığından emin olun!",
			"10" : "Mikrofonunuzun sorunsuz çalıştığından emin olun. Mikrofonla alakalı sorunlar izleyicilerinizi olumsuz etkileyecektir!",
			"11" : "Haahi yöneticilerinin talimatlarına ve platform kurallarına uymaya özen gösterin!",
			"12" : "Yatarak veya uzanarak yayın yapmamaya dikkat edin!",
			"13" : "Yayın yaparken kameranın görüş açısını engelleyecek şekilde üzerini örtmeyin!",
			"14" : "İnternet hızınıza dikkat edin, zayıf internet yayınınızın donmasına veya tamamen durmasına sebep olabilir!"
	};
	this.scam_en = {
			"0" : "Please pay attention to adjust lights in the room and make sure light is turned on.",
			"1" : "Please make sure that your camera is qualified enough and pay attention to meet the requirements about positioning while broadcasting",
			"2" : "Hosts can't leave the broadcast for a long time. Because it leads users to leave the show room.",
			"3" : "Please pay attention to dress appropriately and make sure you look nice .",
			"4" : "Please adjust your equipment, and network and avoid the screen getting black in the process of live stream.",
			"5" : "Please pay attention to have a very good interactive communication with users. Don't forget that, better communication brings more users .and remind users to follow you and send you gifts",
			"6" : "It is forbidden to speak and play with the phone during broadcast for a long time.",
			"7" : "Please pay attention to have a rich background while  broadcasting . You can decorate your background with toys, books, etc...",
			"8" : "It is forbidden to broadcast unauthorized film and television works for long period of times without attending the room in order to make the time pass.",
			"9" : "Please pay attention that your microphone doesn't block your face.",
			"10" : "Please make sure your microphone doesn't have any problem. All problems with microphone will effect your audience",
			"11" : "Please don’t ignore the Admins instructions and obey the rules. ",
			"12" : "Laying down while broadcasting is strictly prohibited",
			"13" : "Please don’t cover the camera while broadcasting.",
			"14" : "please pay attention to te internet speed , weak internet might cause to stop your broadcast . "
		};

	//警告类违规
	this.law_cn = {
			" 0" : "你直播已经·被停了，因为你忽视admen的信息",
			" 1" : "严禁直播时主播5分钟以上不出现在画面中，禁止长时间空麦，恶意黑屏",
			" 2" : "直播已经停止了，因为严禁以任何形式表演带有色情、引起他人性欲、低级趣味的内容",
			" 3" : "直播已经停止了，因为主播不在而还叫其他人来直播",
			" 4" : "直播已经停止了，因为直播的衣服很性感",
			" 5" : "直播已经停止了，因为主播在抽烟",
			" 6" : "直播已经被停了，因为禁止使用或转播他人视频，禁止挂录像，图片，需本人主持，禁止替播",
			" 7" : "严禁恶意攻击他人，包括谩骂、诽谤、地域攻击等",
			" 8" : "严禁散布谣言，扰乱破坏，社会以及平台秩序",
			" 9" : "严禁寻衅滋事，主导煽动粉丝与其它主播用户发生矛盾",
			" 10" : "严禁散布谣言，扰乱破坏，社会以及平台秩序",
			" 11" : "严禁谈论关于政治、宗教、违法的话题",
			" 12" : "严禁使用任何形式宣传其他同类型语音、视频平台，以及广告",
			" 13" : "严禁表演危害，威胁生命健康，人身安全的表演",
			" 14" : "直播已经被亭了，因为严禁展示毒品样品，表演及传播，禁止一切与毒品相关的内容",
			" 15" : "严禁散布暴力、恐怖或者教唆犯罪的",
			" 16" : "严禁直播违反国家法律法规的内容"
		};

	this.law_ar = {
			"0" : "تم إيقاف البث بسبب تجاهل تعليمات أدمن الادارة .",
			"1" : "عذراً ! تم إيقاف البث بسبب مرور عدة دقائق من البث ولم يكن المضيف موجود .",
			"2" : "عذراً ! تم إيقاف البث لإنه يُحظر على المضيف القيام بأي حركات ، أو أصوات بها إيحاءات جنسية ، أو أي تقديم أي مواد إباحية أثناء البث المباشر .",
			"3" : "عذراً ! تم إيقاف البث بسبب تواجد شخص آخر نيابةً عن المضيف الأصلي .",
			"4" : "عذراً ! تم إيقاف البث لارتداء المضيف ملابس غير لائقة بها إيحاءات جنسية .",
			"5" : "انتبه ! يُمنع التدخين بأنواعه نهائياً أثناء البث المباشر .",
			"6" : "عذراً ! تم إيقاف البث بسبب إستعمال المضيف لفيديو مسجل ، أو وضع تسجيلات صوتية ، أو تعليق صور دون تواجده .",
			"7" : "عذراً ! تم إيقاف البث لأنه يحتوي على سب ، أو تشهير ، أو عنصرية ضد الآخرين .",
			"8" : "عذراً ! تم إيقاف البث بسبب نشر إشاعات لتشويه صورة الموقع .",
			"9" : "عذراً ! تم إيقاف البث بسبب  الدعوى إلى التشجار بين المستخدمين .",
			"10" : "عذراً ! تم إيقاف البث بسبب نشر إشاعات مغلوطة تؤثر سلباً على المجتمع .",
			"11" : "عذراً ! تم  إيقاف العرض لتحدث المضيف في مواضيع لها علاقة بالسياسة أو الدين أو معارضة للقانون .",
			"12" : "عذراً ! تم إيقاف البث لعرض المضيف إعلانات ، أو عمل دعاية لأي مواقع تقدم محتوى مشابه للمحتوى المقدم من موقع 7 نجوم .",
			"13" : "عذراً ! تم إيقاف البث بسبب العروض الخطرة التي تهدد السلامة الشخصية أو العامة .",
			"14" : "عذراً ! تم إيقاف البث بسبب تعاطي والترويج لتعاطي أي ممنوعات مثل المخدرات والخمور وغيرها .",
			"15" : "عذراً ! تم إيقاف البث بسبب التحريض على العنف أو الإرهاب أو إرتكاب جرائم  .",
			"16" : "عذراً ! تم إيقاف البث بسبب مخالفة المضيف لقوانين الدولة التي يقدم البث من خلالها . "
		};

	this.law_tr = {
			"0" : "Haahi yöneticilerinin söylediklerini dikkate alıp, talimatlara muhakkak uymanız gerekmektedir.",
			"1" : "Mola için verilen 4 dakikalık süre haricinde, yayını terketmek yasaktır!",
			"2" : "Yayın esnasında pornografik, erotik veya herhangi seksüel anlamda görsel veya sesli harekette bulunmak yada içerik yayınlamak kesinlikle yasaktır!",
			"3" : "Kendi yerinize, başkasına yayın yaptırmak yasaktır!",
			"4" : "Fazla açık giyinmek yasaktır!",
			"5" : "Yayın esnasında sigara içmek yasaktır!",
			"6" : "Ses veya video kaydını kullanmak yasaktır!",
			"7" : "Başkaları hakkında kötü niyetli konuşmak veya iftira atmak yasaktır.",
			"8" : "Yönetim hakkında olumsuz söylentiler yaymak veya küçük düşürücü ifadeler kullanmak yasaktır!",
			"9" : "Kullanıcıları kışkırtmak, kavga çıkartmak ve huzuru bozmak yasaktır!",
			"10" : "Olumsuz söylentiler yaymak, kullanıcı ve yayıncıları rahatsız etmek, topluluğa zarar verici ve huzursuz edici hareketlerde bulunarak platform kurallarını çiğnemek yasaktır!",
			"11" : "Din veya politika hakkında konuşmak yasaktır!",
			"12" : "Haahi ile benzer konsepte sahip platformların reklamını yapmak yasaktır!",
			"13" : "Yayın esnasında insan hayatını tehlikeye atan, güvenliği tehdit eden içeriklerde gösteri yapmak yasaktır!",
			"14" : "Uyuşturucu hakkında konuşmak ve uyuşturucu ve uyuşturuc ile alakalı materyalleri göstermek yasaktır!",
			"15" : "Şiddet, korku, suça teşvik edici konularda yayın yapmak yasaktır!",
			"16" : "Yayında hükümet aleyhinde konuşmak yasaktır!"
		};

	this.law_en = {
			"0" : "It’s forbidden to ignore or slander the platform Admins.",
			"1" : "It's forbidden to leave broadcast screen more than few minutes.",
			"2" : "It is strictly prohibited the performance of porn and any sexual act or sound by the host and any other related contents.",
			"3" : "It's forbidden to broadcast instead of the real host.",
			"4" : "Sexual dressing is strictly forbidden.",
			"5" : "Smoking is strictly forbidden while broadcasting.",
			"6" : "It's forbidden to use any old recording sound or video",
			"7" : "Any malicious and slander attacks against others is forbidden.",
			"8" : "It's forbidden to abuse and spread rumors about   the administration",
			"9" : "It's forbidden to incite or start a quarrel with the Users.",
			"10" : "It is forbidden to spread rumors, disturb, undermine society and break the platform rules.",
			"11" : "It's forbidden to talk about religion and politics.",
			"12" : "It's forbidden to promote or advertise any other platform or website similar to ours.",
			"13" : "It's forbidden to perform damaging human life and threatening human safety.",
			"14" : "It's forbidden to show or talk about drugs, or show how to use drugs. All contents about drugs are forbidden.",
			"15" : "It's forbidden to spread violence, fear and instigate to crime.",
			"16" : "It is forbidden to speak against government laws in live show."
		};
}
