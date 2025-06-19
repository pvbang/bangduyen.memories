// Gallery JavaScript
class Gallery {
  constructor() {
    this.mediaItems = [];
    this.filteredItems = [];
    this.currentFilter = "all";
    this.currentView = "grid";
    this.currentLightboxIndex = 0;

    this.init();
  }

  async init() {
    this.showLoading();
    await this.loadMediaItems();
    this.bindEvents();
    this.renderGallery();
    this.hideLoading();
  }

  async loadMediaItems() {
    try {
      // Load images from data/images/
      const imageItems = await this.loadImages();
      // Load videos from data/videos/
      const videoItems = await this.loadVideos();

      this.mediaItems = [...imageItems, ...videoItems];
      this.filteredItems = [...this.mediaItems];

      // Sort by date (newest first)
      this.mediaItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error("Error loading media items:", error);
    }
  }
  async loadImages() {
    const imageItems = [];
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    try {
      // Fetch list of files from the server
      const response = await fetch("data/images/").catch(() => null);

      if (response && response.ok) {
        // Try to parse directory listing (if server supports it)
        const text = await response.text();
        const fileMatches = text.match(
          /<a[^>]*href="([^"]*\.(jpe?g|png|gif|webp))"[^>]*>/gi
        );

        if (fileMatches) {
          fileMatches.forEach((match, index) => {
            const filename = match.match(/href="([^"]*)"/i)[1];
            if (
              filename &&
              !filename.includes("..") &&
              !filename.startsWith("/")
            ) {
              const item = {
                id: `img_${index}`,
                type: "image",
                filename: filename,
                path: `data/images/${filename}`,
                title: this.generateImageTitle(filename),
                date: this.generateRandomDate(),
                description: "Một khoảnh khắc đẹp trong kỷ niệm của chúng ta",
              };
              imageItems.push(item);
            }
          });
        }
      }

      // Fallback: Use known file list (since directory listing might not work)
      if (imageItems.length === 0) {
        // Auto-generated list of all image files in the directory
        const allImageFiles = [
          "_storage_emulated_0_Pictures_Messenger_Messenger_creation_FE991C86-6209-4751-984F-8EE5E3AE7C14.jpeg",
          "1a6607099627b64ad3e667f3656a0a1e_0.jpeg",
          "1b924202c76eb62fa58ce60a0065c22c_0.jpeg",
          "1e1eabd8c34e74771569960ba59ff9cb_0.jpeg",
          "1fd25a0b7f574ee4ba79411bead8f5fd_0.jpeg",
          "3b7086f83b36494462db734a31f558db_0.jpeg",
          "3cc5102585802afe091cd608370faedc_0.jpeg",
          "3ee503c65119eb168326106b7a0d8cd0_0.jpeg",
          "3ff4d6b72fd153e5e7c76bebf646ad60_0.jpeg",
          "4a9a1e2ff84c03b7ef8f1e6224b34006_0.jpeg",
          "4c026b1e55d24e36ae49a5c20b2e4240_0.jpeg",
          "4c3205e6aff6293d83ada9331222520a_0.jpeg",
          "5a0f42b06a2267f5ec7de426593b864e_0.jpeg",
          "5c5cbc955717afcc9664176579976386_0.jpeg",
          "5d890e994602160ffd642a071ae9b55b_0.jpeg",
          "5dfe9c6fc89087cc01aa6ffab200e548_0.jpeg",
          "5f9284ee07a991dfdc6dd3741a210df0_0.jpeg",
          "6a677572603ea28a305af97fbe080801_0.jpeg",
          "7acbfb2b0e5f4bce8db3fc2f30b2cbce_0.jpeg",
          "7b31ff7c6e8816d5bcc1dc21ac9b22aa_0.jpeg",
          "7c2156295d9101f160641f20d1bba9f9_0.jpeg",
          "7f45e8fc035e71260c3287a36f6bc5a1_0.jpeg",
          "8b2107f075301b51af6f2779c4f634e6_0.jpeg",
          "8f912f59ba9a2d06ee2ac2fb8518b931_0.jpeg",
          "8f9614623a405fc65ea6729b84165068_0.jpeg",
          "9a970b7310108cb5a1fc856beb35f76c_0.jpeg",
          "9aa0da535b64b238f90014054252b41c_0.jpeg",
          "9d65afb1ab5737de30e8fbd8ac07a302_0.jpeg",
          "9eb15eda7c36273787920479d4d44592_0.jpeg",
          "16f09273c779b2a8d5bb06836450852f_0.jpeg",
          "17f4443d7019f7127f0206cd1e156020_0.jpeg",
          "39b3fc40f63b3a3b3d0805b3bc478b1f_0.jpeg",
          "066d75a4661be71876055d745a27ce55_0_batch_6_1748927877565.jpg",
          "066d75a4661be71876055d745a27ce55_0.jpeg",
          "71e8f1facd169ae3aa76833275ec8822_0.jpeg",
          "83a73443f8e0acff786fcaa0ab6f4ed4_0.jpeg",
          "84c96de282269b0473e97e73fbf07190_0.jpeg",
          "87ef40937ee33e9102eeb61f5fdaf467_0.jpeg",
          "234a7f8857fc4d584a4cfcc98fcede99_0.jpeg",
          "0488b47aa10f4d54c5d4efc162650a41_0.jpeg",
          "491bc4e6d961e7ffbd9813505f00927f_0.jpeg",
          "491bc4e6d961e7ffbd9813505f00927f_0(1).jpeg",
          "784b4bcc560d5648c943aa50052d2168_0.jpeg",
          "1178d3c5629422bf1d9eed19d543b9c4_0.jpeg",
          "3217fab7235d92e60b8cc65a09186a02_0.jpeg",
          "4804f306269100c07574ffa5c18c6d8d_0.jpeg",
          "6545fcc6ec43820481432c2e2c0eb894_0.jpeg",
          "6822a801695682c68a15fedbf3498448_0.jpeg",
          "7005ed84d729d52533c5bb2502831ae7_0.jpeg",
          "17807e2020dd1581571a467d6abcbd64_0.jpeg",
          "73082d56dd483b7758cabcf3d6889b01_0.jpeg",
          "389379f308991793400b241fb2e2bd70_0.jpeg",
          "5869177b72bf763397d8129810ed5809_0.jpeg",
          "7584334cf69e879a12a6ed65e2bb94a8_0.jpeg",
          "20250525_105137199.jpg",
          "060684416a4b870903898abc60d751e3_0.jpeg",
          "468148697c2b611c1e45ff0c31a7d55b_0.jpeg",
          "008272256310c90f8b9b9d4b1ec232e1_0.jpeg",
          "1746200909303.jpeg",
          "1747067123386.jpeg",
          "1747067180800.jpeg",
          "1747067233550.jpeg",
          "1747067377216.jpeg",
          "1747067566732.jpeg",
          "1747099503744.jpeg",
          "1747099524839.jpeg",
          "1747099551492.jpeg",
          "1747235274333.jpeg",
          "1747238412990.jpeg",
          "1747239265754.jpeg",
          "1747239328966.jpeg",
          "1747239447440.jpeg",
          "1747239480929.jpeg",
          "1747239539239.jpeg",
          "1747240525084.jpeg",
          "1747240648734.jpeg",
          "1747240670827.jpeg",
          "1747240686586.jpeg",
          "1747412046797.jpeg",
          "1747412078362.jpeg",
          "1747412179832.jpeg",
          "1747412197264.jpeg",
          "1747412229986.jpeg",
          "1747412248449.jpeg",
          "1747752182072.jpg",
          "1748167005387.jpg",
          "1748167021792.jpg",
          "1748167045099.jpg",
          "1748167130901.jpg",
          "1748167239073.jpg",
          "1748167250999.jpg",
          "1748167269854.jpg",
          "1748167285383.jpg",
          "1748167297102.jpg",
          "1748167325416.jpg",
          "1748447472848.jpeg",
          "1748447539697.jpeg",
          "1748447865723.jpeg",
          "1748447902717.jpeg",
          "1748591244873.jpeg",
          "1748591572950.jpeg",
          "1748849678617.jpg",
          "1748928006659.jpg",
          "1748928090120.jpg",
          "1748928108194.jpg",
          "1749224822777.jpg",
          "1749224851405.jpg",
          "1749224874028.jpg",
          "1749224899825.jpg",
          "1749224919748.jpg",
          "1749224947088.jpg",
          "1749224964551.jpg",
          "1749224986237.jpg",
          "1749224999740.jpg",
          "1749225026282.jpg",
          "1749740224110.jpg",
          "a.jpg",
          "a4a531e9aa7ed93a809ebf818e369a13_0.jpeg",
          "a6fb6b6e2e79d4e2973b8174a5368587_0.jpeg",
          "a25696c418998ac78d5100885c65fb24_0.jpeg",
          "a96600d1cbc19fc62dfb30fb2e4acbaa_0.jpeg",
          "ab98c6b2dbc3f39b4e331e61bba7435e_0.jpeg",
          "abb7930fefc4d9fbfa2913c1a6cd25a8_0.jpeg",
          "af6c5e4427f5424dc2dfac35f6799db5_0.jpeg",
          "afc20093bd03aab5ddc9b912b48ae776_0.jpeg",
          "App quó chòi.jpg",
          "b8d66754669062e1a69c1f1cf8df0b76_0.jpeg",
          "b40c91046fd7fcdd081c62e43484e415_0.jpeg",
          "b437face521bc0c73c79a78afae13b74_0.jpeg",
          "bf308f36bd6f21110a04b1b0b53a5ca5_0.jpeg",
          "c5c996f87c4c80927308e02b7c6fd5b8_0.jpeg",
          "c6e0dd7f760b6bb0f255bbd50f5673e1_0.jpeg",
          "c68d4356f5a07de2da065412c609dd0d_0.jpeg",
          "c6096856d771c973821add38592f278f_0.jpeg",
          "Cái đồ đẹp chai này.jpg",
          "cff2db2a0b86f22e99ce22127ebf087e_0.jpeg",
          "Chài chài ảnh hạnh phúc.jpg",
          "Chân dài 2m.jpeg",
          "Chân dài 2m1.jpeg",
          "Cổ tích quó.jpg",
          "Công túa rất buồn...ngủ.jpg",
          "d20f0acebb2a3f6231bf3dea707c1a78_0.jpeg",
          "Đã quó đã quó.jpg",
          "Dịu ka quó chài.jpg",
          "Đứng im chụp méng coi.jpg",
          "Đứng im đứng im.jpg",
          "E hèm, thấy gòi nha.jpg",
          "e7ff57f61f1165b5e8738da09ac272d4_0.jpeg",
          "Êy nha êy nha.png",
          "Gian tình gian tình.jpg",
          "Hehehe chít anh với tui .jpg",
          "image_1.jpg.png",
          "IMG_20250329_200506_086.webp",
          "IMG_20250329_200537_641.webp",
          "IMG_20250329_200926_993.webp",
          "IMG_20250329_203200_406.jpg",
          "IMG_20250329_214843.jpg",
          "IMG_20250330_111113.jpg",
          "IMG_20250424_094715.jpg",
          "IMG_20250428_210243_295.webp",
          "IMG_20250430_124445.jpg",
          "IMG_20250507_074815.jpg",
          "IMG_20250507_085445.jpg",
          "IMG_20250507_085543.jpg",
          "IMG_20250507_085624.jpg",
          "IMG_20250507_085709.jpg",
          "IMG_20250512_200227_782.webp",
          "IMG_20250512_200426_155.webp",
          "IMG_20250523_194707.jpg",
          "IMG_20250523_194714.jpg",
          "IMG_20250523_194717.jpg",
          "IMG_20250523_194719.jpg",
          "IMG_20250523_194736.jpg",
          "IMG_20250523_194743.jpg",
          "IMG_20250523_194749.jpg",
          "IMG_20250523_194752.jpg",
          "IMG_20250523_194755.jpg",
          "IMG_20250529_152419.jpg",
          "IMG_20250607_200458.jpg",
          "IMG_20250607_200528.jpg",
          "IMG_20250602035833246_batch_3_1749112559534.jpg",
          "IMG_20250602040041473_batch_0_1749112557419.jpg",
          "IMG_20250602040047855_batch_1_1749112558116.jpg",
          "IMG_20250602040143344_batch_2_1749112558830.jpg",
          "IMG_20250602041338316.jpg",
          "IMG_20250602041415634.jpg",
          "IMG_20250602232059719_batch_5_1748927876865.jpg",
          "IMG_20250602232059719.jpg",
          "IMG_20250602232449741_batch_4_1748927876189.jpg",
          "IMG_20250602232449741.jpg",
          "IMG_20250602232526626.jpg",
          "IMG_20250602233146648_batch_1_1748927874198.jpg",
          "IMG_20250602233240185_batch_2_1748927874832.jpg",
          "IMG_20250606223224296.jpg",
          "IMG_20250606223321858.jpg",
          "IMG_20250606223345944.jpg",
          "IMG_20250606223428355.jpg",
          "IMG_20250606223534411.jpg",
          "IMG_20250606223609934.jpg",
          "IMG_20250606223618879.jpg",
          "IMG_20250606223625453.jpg",
          "IMG_20250606223715641.jpg",
          "IMG_20250606223815264.jpg",
          "IMG_20250606223831418.jpg",
          "IMG_20250606224011026.jpg",
          "IMG_20250606224019821.jpg",
          "IMG_20250606224034173.jpg",
          "IMG_20250606224037908.jpg",
          "IMG_20250606224054944.jpg",
          "IMG_20250606224220031.jpg",
          "IMG_20250606224353089.jpg",
          "IMG_20250606224402230.jpg",
          "IMG_20250608090550731.jpg",
          "IMG_20250608090610514.jpg",
          "IMG_20250608090637152.jpg",
          "IMG_20250608090934066.jpg",
          "IMG_20250608091041831.jpg",
          "IMG_20250608091053907.jpg",
          "IMG_20250608091104883.jpg",
          "IMG_20250608091114324.jpg",
          "Làm gì cũng đệp .jpg",
          "Mặt tròn mặt chỉnh.jpg",
          "MEITU_20250430_201213044.jpg",
          "MEITU_20250430_202501384.jpg",
          "MEITU_20250430_203230880.jpg",
          "MEITU_20250430_205555793.jpg",
          "MEITU_20250430_211817673.jpg",
          "MEITU_20250430_214849523.jpg",
          "MEITU_20250501_143901830.jpg",
          "MEITU_20250502_225307655.jpg",
          "MEITU_20250502_225406672.jpg",
          "MEITU_20250502_225606130.jpg",
          "MEITU_20250502_225653159.jpg",
          "MEITU_20250502_230012400.jpg",
          "MEITU_20250524_102159243.jpg",
          "MEITU_20250524_102159243(1).jpg",
          "MEITU_20250524_102639611.jpg",
          "MEITU_20250524_102639611(1).jpg",
          "MEITU_20250524_103407811.jpg",
          "MEITU_20250524_104530922.jpg",
          "MEITU_20250608_092516847.jpg",
          "MEITU_20250608_092737361.jpg",
          "MEITU_20250608_092834689.jpg",
          "MEITU_20250608_093135052.jpg",
          "MEITU_20250608_093149127.jpg",
          "MEITU_20250608_093716828.jpg",
          "MEITU_20250608_093829217.jpg",
          "MEITU_20250608_094342787.jpg",
          "MEITU_20250612_215615698.jpg",
          "Messenger_creation_1B1AD851-8A7E-4E72-9516-20270BD0D023.jpeg",
          "Messenger_creation_1CF10395-24AD-41B3-ABAF-70B2E0DF86CC.jpeg",
          "Messenger_creation_2F104CBC-FC26-4D1E-9B5D-CE638E4DEDDD.jpeg",
          "Messenger_creation_979EFFF4-3C2E-4AA2-B5A8-FCEEE5EB036D.jpeg",
          "Messenger_creation_1378566C-F295-4146-AC56-0C762D047DD4.jpeg",
          "Messenger_creation_A80449ED-D13D-49A6-BF80-8EFE8BC9AED3.jpeg",
          "Messenger_creation_AED6C5E9-B9C1-4E4E-A5FC-7D8BE6D94E62.jpeg",
          "Messenger_creation_CDED71B4-2E94-4E0A-BA34-1E5A209F80F1.jpeg",
          "Mít ướt.jpg",
          "Mlem mlem.jpeg",
          "Mở 1 mắt.jpg",
          "Nhai đòu bây giờ.jpg",
          "Nhắm 1 mắt.jpeg",
          "Ô ô ô ô.jpg",
          "Ối ối ối.jpg",
          "Pic.jpg",
          "README.md",
          "retouch_2025061221494410.jpg",
          "retouch_2025061221541470.png",
          "Sao hay liếc quó.jpg",
          "SAVE_20250330_111342.jpg",
          "Tay ai vị kè.jpg",
          "Tuân lệnh công chúa.jpg",
          "Ú òa, bác sĩ Bằng đem xoài cho ăn.jpeg",
          "Và công túa chỉ có mình a thou.jpg",
          "Very hờn.jpg",
          "Very khó lói.jpg",
          "Xinh gái 10đ.jpg",
          "Ỷ đẹp trai đó.jpg",
        ];

        // Filter out README.md and any non-image files
        const filteredFiles = allImageFiles.filter((filename) => {
          const extension = filename.toLowerCase().split(".").pop();
          return (
            imageExtensions.includes("." + extension) &&
            filename !== "README.md"
          );
        });

        filteredFiles.forEach((filename, index) => {
          const item = {
            id: `img_${index}`,
            type: "image",
            filename: filename,
            path: `data/images/${filename}`,
            title: this.generateImageTitle(filename),
            date: this.generateRandomDate(),
            description: "Một khoảnh khắc đẹp trong kỷ niệm của chúng ta",
          };
          imageItems.push(item);
        });
      }
    } catch (error) {
      console.error("Error loading images:", error);
    }

    return imageItems;
  }

  async loadVideos() {
    const videoItems = [];
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];

    try {
      // In a real implementation, you would fetch the list of files from the server
      // For now, we'll simulate with some sample videos
      const sampleVideos = [
        // Videos will be added here as they are downloaded
      ];

      for (let i = 0; i < sampleVideos.length; i++) {
        const filename = sampleVideos[i];
        const item = {
          id: `vid_${i}`,
          type: "video",
          filename: filename,
          path: `data/videos/${filename}`,
          title: this.generateVideoTitle(filename),
          date: this.generateRandomDate(),
          description: "Một khoảnh khắc động trong kỷ niệm của chúng ta",
        };
        videoItems.push(item);
      }
    } catch (error) {
      console.error("Error loading videos:", error);
    }

    return videoItems;
  }
  generateImageTitle(filename) {
    // Nếu filename có tiếng Việt có ý nghĩa, sử dụng nó
    const vietnameseNames = {
      "App quó chòi.jpg": "App quá chói 📱✨",
      "Chài chài ảnh hạnh phúc.jpg": "Chài chài ảnh hạnh phúc 😊",
      "Chân dài 2m.jpeg": "Chân dài 2m 👗",
      "Chân dài 2m1.jpeg": "Chân dài 2m1 👠",
      "Cái đồ đẹp chai này.jpg": "Cái đồ đẹp chai này 😍",
      "Công túa rất buồn...ngủ.jpg": "Công túa rất buồn...ngủ 😴👑",
      "Cổ tích quó.jpg": "Cổ tích quá 🧚‍♀️",
      "Dịu ka quó chài.jpg": "Dịu ka quá chài 🥰",
      "E hèm, thấy gòi nha.jpg": "E hèm, thấy rồi nha 👀",
      "Gian tình gian tình.jpg": "Gian tình gian tình 💕",
      "Hehehe chít anh với tui .jpg": "Hehehe chít anh với tui 😄",
      "Làm gì cũng đệp .jpg": "Làm gì cũng đẹp ✨",
      "Mlem mlem.jpeg": "Mlem mlem 😋",
      "Mít ướt.jpg": "Mít ướt 🥭",
      "Mặt tròn mặt chỉnh.jpg": "Mặt tròn mặt chỉnh 😊",
      "Mở 1 mắt.jpg": "Mở 1 mắt 😉",
      "Nhai đòu bây giờ.jpg": "Nhai đậu bây giờ 🥜",
      "Nhắm 1 mắt.jpeg": "Nhắm 1 mắt 😌",
      "Sao hay liếc quó.jpg": "Sao hay liếc quá 👁️",
      "Tay ai vị kè.jpg": "Tay ai vậy kia 🤚",
      "Tuân lệnh công chúa.jpg": "Tuân lệnh công chúa 👑",
      "Very hờn.jpg": "Very hờn 😤",
      "Very khó lói.jpg": "Very khó lòi 😅",
      "Và công túa chỉ có mình a thou.jpg":
        "Và công túa chỉ có mình anh thôi 👑💕",
      "Xinh gái 10đ.jpg": "Xinh gái 10 điểm 💯",
      "Êy nha êy nha.png": "Êy nha êy nha 😘",
      "Ô ô ô ô.jpg": "Ô ô ô ô 😮",
      "Ú òa, bác sĩ Bằng đem xoài cho ăn.jpeg":
        "Ú òa, bác sĩ Bằng đem xoài cho ăn 🥭👨‍⚕️",
      "Đã quó đã quó.jpg": "Đã quá đã quá 😍",
      "Đứng im chụp méng coi.jpg": "Đứng im chụp mình coi 📸",
      "Đứng im đứng im.jpg": "Đứng im đứng im 🤳",
      "Ối ối ối.jpg": "Ối ối ối 😲",
      "Ỷ đẹp trai đó.jpg": "Ỷ đẹp trai đó 😎",
    };

    if (vietnameseNames[filename]) {
      return vietnameseNames[filename];
    }

    // Nếu là ảnh IMG hoặc MEITU, tạo title dựa trên ngày
    if (filename.startsWith("IMG_") || filename.startsWith("MEITU_")) {
      const dateMatch = filename.match(/(\d{8})/);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `Kỷ niệm ngày ${day}/${month}/${year} 📸`;
      }
      return filename.startsWith("MEITU_")
        ? "Ảnh đã chỉnh sửa ✨"
        : "Khoảnh khắc đẹp 📷";
    }

    // Nếu là ảnh Messenger
    if (filename.startsWith("Messenger_creation_")) {
      return "Kỷ niệm trên Messenger 💬";
    }

    // Các trường hợp khác
    const titles = [
      "Khoảnh khắc ngọt ngào 💕",
      "Nụ cười rạng rỡ 😊",
      "Hạnh phúc bên nhau 👫",
      "Yêu thương ngọt ngào 💖",
      "Kỷ niệm đẹp ✨",
      "Tình yêu đẹp nhất 💝",
    ];

    // Sử dụng hash của filename để chọn title nhất quán
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = ((hash << 5) - hash + filename.charCodeAt(i)) & 0xffffffff;
    }
    return titles[Math.abs(hash) % titles.length];
  }

  generateVideoTitle(filename) {
    const baseName = filename.split(".")[0];
    const titles = [
      "Video kỷ niệm",
      "Khoảnh khắc động",
      "Hạnh phúc cùng nhau",
      "Tình yêu của chúng ta",
      "Kỷ niệm đẹp",
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  generateRandomDate() {
    const start = new Date(2025, 1, 8); // Feb 8, 2025
    const end = new Date();
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return date.toISOString().split("T")[0];
  }

  bindEvents() {
    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    // View buttons
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setView(e.target.dataset.view);
      });
    });

    // Keyboard navigation for lightbox
    document.addEventListener("keydown", (e) => {
      if (document.getElementById("lightbox").classList.contains("active")) {
        if (e.key === "Escape") {
          this.closeLightbox();
        } else if (e.key === "ArrowLeft") {
          this.prevMedia();
        } else if (e.key === "ArrowRight") {
          this.nextMedia();
        }
      }
    });
  }

  setFilter(filter) {
    this.currentFilter = filter;

    // Update button states
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add("active");

    // Filter items
    if (filter === "all") {
      this.filteredItems = [...this.mediaItems];
    } else {
      this.filteredItems = this.mediaItems.filter((item) => {
        if (filter === "images") return item.type === "image";
        if (filter === "videos") return item.type === "video";
        return true;
      });
    }

    this.renderGallery();
  }

  setView(view) {
    this.currentView = view;

    // Update button states
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-view="${view}"]`).classList.add("active");

    // Update grid class
    const grid = document.getElementById("galleryGrid");
    grid.className = `gallery-grid ${view === "masonry" ? "masonry" : ""}`;
  }

  renderGallery() {
    const grid = document.getElementById("galleryGrid");
    grid.innerHTML = "";

    this.filteredItems.forEach((item, index) => {
      const galleryItem = this.createGalleryItem(item, index);
      grid.appendChild(galleryItem);
    });
  }

  createGalleryItem(item, index) {
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.dataset.type = item.type;
    div.addEventListener("click", () => this.openLightbox(index));

    const mediaContainer = document.createElement("div");
    mediaContainer.className = "media-container";

    if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.path;
      img.alt = item.title;
      img.onerror = () => {
        img.src =
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+ScOvbmggxJFhbmcgxJHGsOG7o2MgdOG6o2k8L3RleHQ+PC9zdmc+";
      };
      mediaContainer.appendChild(img);
    } else if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.path;
      video.preload = "metadata";
      mediaContainer.appendChild(video);

      const playButton = document.createElement("button");
      playButton.className = "play-button";
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      mediaContainer.appendChild(playButton);
    }

    const overlay = document.createElement("div");
    overlay.className = "media-overlay";

    const info = document.createElement("div");
    info.className = "media-info";

    const title = document.createElement("div");
    title.className = "media-title";
    title.textContent = item.title;

    const date = document.createElement("div");
    date.className = "media-date";
    date.textContent = this.formatDate(item.date);

    info.appendChild(title);
    info.appendChild(date);
    overlay.appendChild(info);
    mediaContainer.appendChild(overlay);

    div.appendChild(mediaContainer);

    return div;
  }

  openLightbox(index) {
    this.currentLightboxIndex = index;
    const item = this.filteredItems[index];

    const lightbox = document.getElementById("lightbox");
    const mediaContainer = document.getElementById("lightboxMedia");
    const infoContainer = document.getElementById("lightboxInfo");

    // Clear previous content
    mediaContainer.innerHTML = "";

    if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.path;
      img.alt = item.title;
      mediaContainer.appendChild(img);
    } else if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.path;
      video.controls = true;
      video.autoplay = true;
      mediaContainer.appendChild(video);
    }

    // Update info
    infoContainer.innerHTML = `
            <div class="lightbox-title">${item.title}</div>
            <div class="lightbox-date">${this.formatDate(item.date)}</div>
            <div class="lightbox-description">${item.description}</div>
        `;

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.classList.remove("active");
    document.body.style.overflow = "";

    // Stop any playing videos
    const video = lightbox.querySelector("video");
    if (video) {
      video.pause();
    }
  }

  prevMedia() {
    if (this.currentLightboxIndex > 0) {
      this.openLightbox(this.currentLightboxIndex - 1);
    }
  }

  nextMedia() {
    if (this.currentLightboxIndex < this.filteredItems.length - 1) {
      this.openLightbox(this.currentLightboxIndex + 1);
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  showLoading() {
    document.getElementById("loading").classList.add("show");
  }

  hideLoading() {
    document.getElementById("loading").classList.remove("show");
  }
}

// Global functions for lightbox navigation
function closeLightbox() {
  gallery.closeLightbox();
}

function prevMedia() {
  gallery.prevMedia();
}

function nextMedia() {
  gallery.nextMedia();
}

// Initialize gallery when DOM is loaded
let gallery;
document.addEventListener("DOMContentLoaded", () => {
  gallery = new Gallery();
});

// Utility function to download images/videos from Google Drive
async function downloadFromGoogleDrive() {
  const imagesFolderId = "1-0DvqbcbIYKC9og5-n_jh_6YO2otC9XF";
  const videosFolderId = "1-3TWO9LyMW0CeG76DaNEXMInwj0esrrR";

  console.log("Để tải file từ Google Drive, bạn cần:");
  console.log("1. Truy cập vào các link folder");
  console.log("2. Tải từng file một cách thủ công");
  console.log("3. Hoặc sử dụng Google Drive API với authentication");
  console.log(
    "Images folder: https://drive.google.com/drive/folders/" + imagesFolderId
  );
  console.log(
    "Videos folder: https://drive.google.com/drive/folders/" + videosFolderId
  );
}

// Function to add new media items dynamically
function addMediaItem(type, filename, title, description) {
  const item = {
    id: `${type}_${Date.now()}`,
    type: type,
    filename: filename,
    path: `data/${type}s/${filename}`,
    title: title || `${type === "image" ? "Hình ảnh" : "Video"} mới`,
    date: new Date().toISOString().split("T")[0],
    description:
      description || "Một khoảnh khắc đẹp trong kỷ niệm của chúng ta",
  };

  gallery.mediaItems.unshift(item);
  gallery.setFilter(gallery.currentFilter); // Refresh the current view
}
