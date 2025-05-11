# Chào mừng đến với Trung's Blog! ![Blog Banner](https://via.placeholder.com/1200x300?text=Welcome+to+Trung%27s+Blog)

Đây là nơi tôi giới thiệu các dự án cá nhân và chia sẻ những kiến thức, kinh nghiệm tôi tích lũy được trong quá trình học tập và làm việc với công nghệ phần mềm và trí tuệ nhân tạo.

---

## Về tôi ![Avatar](https://via.placeholder.com/150?text=Trung)

Chào bạn, tôi là **Cao Đức Trung**,tại Nghệ An, sinh năm 2005 và hiện là sinh viên ngành **Công nghệ thông tin** tại trường Đại học Phenikaa.

Tôi là một lập trình viên hướng nội, đam mê với các công nghệ phần mềm và trí tuệ nhân tạo (AI). Tôi yêu thích **xem phim** 🎬 và **chơi game cốt truyện** 🎮. Mục tiêu của tôi là trở thành lập trình viên chuyên sâu về AI, đặc biệt là các ứng dụng trong lĩnh vực nhận diện khuôn mặt, giao thông và tự động hóa.

Hiện tại, tôi đang tập trung học và nghiên cứu về các mô hình AI trong giao thông đô thị, và tôi đã xây dựng một hệ thống máy tính mạnh mẽ để phục vụ việc training các mô hình AI.

Bên cạnh AI, tôi cũng yêu thích phát triển các ứng dụng web **full-stack** 🌐. Các công cụ và ngôn ngữ tôi thường sử dụng bao gồm **Python**, **C++**, **Java**, và tôi cũng làm việc với **Svel# Báo cáo Phân tích và Khắc phục Lỗi Prerender trong SvelteKit trên Windows

**Ngày:** 11 tháng 5 năm 2025
**Người báo cáo:** TrungCao
**Vấn đề:** Lỗi build dự án SvelteKit trên Windows khi sử dụng ký tự đại diện (`*`) trong `prerender.entries`, trong khi hoạt động bình thường trên Linux.

## 1. Giới thiệu

Báo cáo này phân tích nguyên nhân gây ra lỗi trong quá trình build (biên dịch) một dự án SvelteKit trên hệ điều hành Windows khi cấu hình `kit.prerender.entries` trong tệp `svelte.config.js` sử dụng các ký tự đại diện (`*`) để chỉ định nhiều tệp hoặc thư mục. Lỗi này không xuất hiện khi thực hiện build trên môi trường Linux. Báo cáo cũng trình bày chi tiết giải pháp đã được triển khai để khắc phục vấn đề này, đảm bảo tính tương thích đa nền tảng.

## 2. Mô tả Lỗi

Khi người dùng thực hiện lệnh build dự án SvelteKit (thường là `npm run build` hoặc tương đương), quá trình build bị dừng và báo lỗi trên môi trường Windows. Lỗi cụ thể thường liên quan đến việc SvelteKit không thể phân giải hoặc tìm thấy các đường dẫn (routes) được định nghĩa bằng ký tự đại diện trong mảng `prerender.entries`.

**Cấu hình gây lỗi ví dụ (trong `svelte.config.js`):**

```javascript
// ...
kit: {
    adapter: adapter(),
    prerender: {
        entries: [
            "*",
            "/api/posts/page/*",
            "/blog/category/*/page/",
            "/blog/category/*/page/*",
            // ... các entries khác tương tự
        ],
    },
},
// ...
Người dùng nhận thấy rằng trên Linux, các ký tự đại diện này dường như được diễn giải đúng cách, cho phép SvelteKit tìm và prerender các trang tương ứng. Tuy nhiên, trên Windows, cơ chế này không hoạt động như mong đợi.

3. Phân tích Nguyên nhân Lỗi
Sự khác biệt trong hành vi giữa Windows và Linux trong trường hợp này chủ yếu xuất phát từ cách các hệ điều hành và công cụ xử lý việc mở rộng tên tệp (filename expansion) hoặc "globbing":

Shell Globbing (Linux/macOS):

Trên các hệ thống Unix-like (Linux, macOS), shell (như Bash, Zsh) thường có khả năng tự động mở rộng các ký tự đại diện (ví dụ: *, ?) thành một danh sách các tệp hoặc thư mục khớp với mẫu đó trước khi truyền chúng làm đối số cho một chương trình.
Mặc dù trong ngữ cảnh của tệp cấu hình JavaScript (svelte.config.js), việc mở rộng này không được thực hiện trực tiếp bởi shell, nhưng có thể các công cụ hoặc thư viện bên dưới mà SvelteKit sử dụng có hành vi khác nhau hoặc dựa vào các tiện ích hệ thống có sẵn trên Linux để xử lý các mẫu này một cách linh hoạt hơn.
Xử lý đường dẫn trên Windows:

Windows Command Prompt (CMD) và PowerShell có cơ chế mở rộng ký tự đại diện khác biệt và thường không tự động mở rộng chúng theo cách mà shell Unix thực hiện cho các ứng dụng.
Quan trọng hơn, khi một ứng dụng Node.js (như SvelteKit build process) đọc một chuỗi ký tự như "/blog/category/*/page/*" từ một tệp cấu hình, nó không tự động diễn giải * như một lệnh để quét hệ thống tệp. Việc này đòi hỏi một logic lập trình cụ thể để thực hiện "globbing".
Hành vi của SvelteKit adapter-static:

adapter-static của SvelteKit được thiết kế để tạo ra các tệp HTML tĩnh. Để làm điều này, nó cần một danh sách cụ thể các trang cần được prerender.
Mục nhập "*" trong prerender.entries là một trường hợp đặc biệt được SvelteKit xử lý để bao gồm tất cả các trang không có tham số (non-parameterized routes).
Tuy nhiên, đối với các mẫu phức tạp hơn như "/blog/category/*/page/*", SvelteKit không có cơ chế tích hợp sẵn để tự động quét hệ thống tệp và mở rộng các ký tự đại diện này thành danh sách các đường dẫn cụ thể trên tất cả các nền tảng một cách nhất quán. Nó mong đợi các đường dẫn này đã được giải quyết hoặc có một cơ chế (như tệp +entries.js) để khám phá các tham số cho các tuyến đường động.
Do đó, trên Windows, khi SvelteKit gặp các mẫu này, nó có thể không tìm thấy các tệp/tuyến đường tương ứng vì không có logic tích hợp để thực hiện việc "quét và mở rộng" theo kiểu glob. Trên Linux, có thể do sự khác biệt tinh tế trong cách các API hệ thống tệp hoạt động hoặc một số phụ thuộc xử lý điều này một cách không tường minh, dẫn đến việc nó "vô tình" hoạt động hoặc hoạt động trong một số trường hợp hạn chế.
Kết luận nguyên nhân: Lỗi xảy ra trên Windows vì SvelteKit (cụ thể là adapter-static trong quá trình build) không tự động thực hiện việc mở rộng các ký tự đại diện phức tạp trong prerender.entries thành danh sách các tệp cụ thể. Điều này đòi hỏi một giải pháp lập trình rõ ràng để thực hiện việc tìm kiếm tệp dựa trên mẫu (globbing) một cách chủ động.

4. Giải pháp Khắc phục
Giải pháp được đề xuất và đã triển khai là sử dụng thư viện glob của Node.js để chủ động quét hệ thống tệp dựa trên các mẫu được chỉ định và tạo ra một danh sách đầy đủ các đường dẫn cụ thể để cung cấp cho prerender.entries.

4.1. Cài đặt thư viện glob
Thêm glob vào dev dependencies của dự án:

Bash

npm install -D glob
# hoặc
yarn add -D glob
# hoặc
pnpm add -D glob
4.2. Cập nhật tệp svelte.config.js
Điều chỉnh tệp svelte.config.js để sử dụng globSync để tạo danh sách entries:

JavaScript

import adapter from "@sveltejs/adapter-static";
import { mdsvex } from "mdsvex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { globSync } from 'glob'; // Import globSync

/**
 * Chuyển đổi đường dẫn tệp (file path) từ glob thành một đường dẫn URL (route path)
 * mà SvelteKit prerenderer mong đợi.
 * @param {string} filePath - Đường dẫn tệp được trả về từ glob (ví dụ: "src/routes/blog/category/tech/+page.svelte").
 * @returns {string} Đường dẫn URL tương ứng (ví dụ: "/blog/category/tech").
 */
function convertFilepathToRoute(filePath) {
    let route = filePath.replace(/^src\/routes/, '');
    route = route.replace(/\/\+page\.(svelte|md)<span class="math-inline">/, ''\);
route \= route\.replace\(/\\/\\\+server\\\.\(js\|ts\)</span>/, '');
    route = route.replace(/\/\(([^)]+)\)\//g, '/').replace(/^\/\(([^)]+)\)\//, '/');
    if (route.startsWith('//')) {
        route = route.substring(1);
    }
    if (route.endsWith('/index')) {
        route = route.slice(0, -'/index'.length);
    }
    if (route === '') {
        return '/';
    }
    if (!route.startsWith('/')) {
        route = '/' + route;
    }
    return route;
}

/**
 * Tạo danh sách các entries cho prerender.
 * @returns {string[]} Mảng các đường dẫn sẽ được prerender.
 */
function getPrerenderEntries() {
    const entries = new Set();
    entries.add('*'); // Mục nhập đặc biệt của SvelteKit

    const addRoutesFromGlob = (pattern) => {
        globSync(pattern, { nodir: true, posix: true }).forEach(file => {
            const route = convertFilepathToRoute(file);
            entries.add(route);
        });
    };

    // Ánh xạ các entry gốc sang các mẫu glob:
    addRoutesFromGlob("src/routes/api/posts/page/*/+server.{js,ts}");
    addRoutesFromGlob("src/routes/blog/category/*/page/+page.{svelte,md}");
    addRoutesFromGlob("src/routes/blog/category/*/page/*/+page.{svelte,md}");
    addRoutesFromGlob("src/routes/blog/category/page/+page.{svelte,md}");
    addRoutesFromGlob("src/routes/blog/category/page/*/+page.{svelte,md}");
    addRoutesFromGlob("src/routes/blog/page/+page.{svelte,md}");
    addRoutesFromGlob("src/routes/blog/page/*/+page.{svelte,md}");

    const finalEntries = Array.from(entries);
    console.log("Generated prerender entries:", finalEntries); // Để kiểm tra
    return finalEntries;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: [".svelte", ".md"],
    kit: {
        adapter: adapter(),
        prerender: {
            entries: getPrerenderEntries(),
        },
    },
    preprocess: [
        mdsvex({
            extensions: [".md"],
            rehypePlugins: [
                rehypeSlug,
                rehypeAutolinkHeadings,
            ],
        }),
    ],
};

export default config;
4.3. Giải thích giải pháp
globSync: Được sử dụng để tìm kiếm các tệp trong thư mục src/routes khớp với các mẫu đã cho. Tùy chọn posix: true đảm bảo hành vi nhất quán của dấu / trong các mẫu.
convertFilepathToRoute: Hàm này xử lý chuỗi đường dẫn tệp trả về từ globSync và chuyển đổi nó thành định dạng đường dẫn URL mà SvelteKit mong đợi (ví dụ: loại bỏ src/routes, +page.svelte, xử lý (group) và index).
getPrerenderEntries: Hàm này xây dựng danh sách entries cuối cùng. Nó bắt đầu với "*" và sau đó sử dụng addRoutesFromGlob để thêm các đường dẫn được phát hiện từ các mẫu cụ thể. Set được sử dụng để tránh các mục nhập trùng lặp.
5. Lợi ích của Giải pháp
Tính đa nền tảng: Giải pháp này hoạt động nhất quán trên cả Windows, Linux và macOS vì logic globbing được thực hiện một cách tường minh bởi thư viện glob trong môi trường Node.js, không phụ thuộc vào hành vi của shell hệ điều hành.
Minh bạch và dễ kiểm soát: Việc tìm kiếm tệp được thực hiện một cách rõ ràng trong mã nguồn, giúp dễ dàng theo dõi và gỡ lỗi.
Chính xác: Đảm bảo rằng tất cả các trang dự định đều được đưa vào quá trình prerender.
6. Kết luận
Lỗi build SvelteKit trên Windows khi sử dụng ký tự đại diện trong prerender.entries là do SvelteKit không tự động thực hiện việc mở rộng các mẫu phức tạp này thành danh sách tệp cụ thể. Bằng cách tích hợp thư viện glob để chủ động quét và tạo danh sách các đường dẫn cần prerender, vấn đề đã được giải quyết một cách hiệu quả, đảm bảo quá trình build hoạt động chính xác và nhất quán trên các nền tảng khác nhau.teKit** để phát triển giao diện web (front-end).

Với những kỹ năng và kinh nghiệm này, tôi luôn không ngừng học hỏi và phát triển bản thân trong lĩnh vực lập trình và AI, với mong muốn áp dụng công nghệ vào giải quyết các bài toán thực tế.

---

## Dự án & Bài viết Mới nhất

### [Phần mềm Hệ thống Bãi Đỗ Xe Thông Minh](https://github.com/namnguyenit/Smart_Park) 🚗
*Ngày đăng: 28-04-2025*

**Mô tả phần mềm**: Phần mềm Quản lý Bãi Đỗ Xe được xây dựng nhằm hỗ trợ quản lý các hoạt động như:
- Nhập bãi cho xe của khách.
- Quản lý xe đang gửi.
- Thanh toán khi xe rời bãi.
- Tìm kiếm thông tin xe.
- Thống kê thông tin xe và doanh thu.

**Các chức năng chính**:
- **Đăng nhập** 🔐: Cho phép quản lý hoặc người dùng đăng nhập vào hệ thống.
- **Tìm kiếm bãi còn trống** 🔍: Tự động tìm kiếm hoặc lựa chọn bãi xe theo yêu cầu người dùng.
- **Vào bãi** 🅿️: Thêm thông tin xe của khách vào hệ thống khi xe vào bãi.
- **Xe rời bãi** 🏎️: Xử lý khi khách muốn lấy xe, tính toán chi phí gửi xe dựa trên thời gian lưu trú.
- **Tạo bãi** 🏢: Tạo thông tin cho bãi xe.
- **Tìm kiếm xe** 🔑: Tìm kiếm nhanh thông tin xe đã vào bãi.
- **Thống kê** 📊: Xem thống kê chi tiết về xe gửi trong bãi và doanh thu.

[**Xem chi tiết dự án**](https://github.com/namnguyenit/Smart_Park)

---

## Liên hệ

Nếu bạn có câu hỏi, muốn trao đổi về các dự án, công nghệ hoặc có cơ hội hợp tác, đừng ngần ngại liên hệ với tôi qua:

- **Facebook**: [Trung Cao](https://www.facebook.com/trung.cao.2005/) ![Facebook Icon](https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg)
- **GitHub**: [namnguyenit](https://github.com/namnguyenit) ![GitHub Icon](https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg)
- **Email**: [trungcaoduc2005@gmail.com](mailto:trungcaoduc2005@gmail.com) 📧

---

&copy; 2025 Cao Đức Trung (Trung's Blog). Bảo lưu mọi quyền.
