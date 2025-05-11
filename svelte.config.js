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
    // Giả sử glob trả về đường dẫn POSIX (với /) như "src/routes/path/to/file"
    // Nếu glob trả về đường dẫn Windows (với \), cần thay thế trước: filePath = filePath.replace(/\\/g, '/');
    // Tuy nhiên, globSync với `posix: true` thường xử lý việc này.
    let route = filePath.replace(/^src\/routes/, ''); // Xóa tiền tố "src/routes"

    // Xóa các phần đặc trưng của SvelteKit để lấy đường dẫn URL cơ bản
    route = route.replace(/\/\+page\.(svelte|md)$/, ''); // Xóa "/+page.svelte" hoặc "/+page.md"
    route = route.replace(/\/\+server\.(js|ts)$/, '');   // Xóa "/+server.js" hoặc "/+server.ts" (cho API routes)

    // Xóa các route groups (ví dụ: "/(v2)/blog" -> "/blog")
    // Xử lý group ở giữa: /path/(group)/subpath -> /path/subpath
    route = route.replace(/\/\(([^)]+)\)\//g, '/');
    // Xử lý group ở đầu (nếu có sau src/routes): /(group)/path -> /path
    if (route.startsWith('/(') && route.includes(')/')) {
        route = route.substring(route.indexOf(')/') + 2);
    }
    // Dọn dẹp dấu // nếu có
    route = route.replace(/\/\//g, '/');


    // Xóa "/index" nếu là kết quả của việc xóa "+page.svelte" từ một trang index của thư mục
    // (ví dụ: "src/routes/about/index/+page.svelte" -> "/about/index" -> "/about")
    if (route.endsWith('/index')) {
        route = route.slice(0, -'/index'.length);
    }

    // Nếu chuỗi rỗng, đó là trang chủ. Ngược lại, đảm bảo có dấu / ở đầu.
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

    // 1. Mục nhập "*" đặc biệt của SvelteKit: prerender tất cả các trang không có tham số.
    entries.add('*');

    // Hàm trợ giúp để thêm các routes từ glob pattern
    const addRoutesFromGlob = (pattern) => {
        // `nodir: true` để chỉ lấy tệp.
        // `posix: true` để glob sử dụng và cố gắng trả về đường dẫn kiểu POSIX (với /).
        globSync(pattern, { nodir: true, posix: true }).forEach(file => {
            const route = convertFilepathToRoute(file);
            entries.add(route);
        });
    };

    // 2. Ánh xạ các entry gốc của bạn sang các mẫu glob:
    // Lưu ý: Các mẫu glob này tìm kiếm các tệp trang thực tế (`+page.svelte`, `+page.md`)
    // hoặc tệp máy chủ (`+server.js`, `+server.ts`) tương ứng với các mẫu đường dẫn bạn muốn.

    // "/api/posts/page/*"
    // Tìm các tệp server trong src/routes/api/posts/page/[bất_kỳ_thư_mục_con]/+server.{js,ts}
    addRoutesFromGlob("src/routes/api/posts/page/*/+server.{js,ts}");

    // "/blog/category/*/page/"
    // Tìm các tệp +page trong src/routes/blog/category/[bất_kỳ_danh_mục]/page/+page.{svelte,md}
    // Đường dẫn kết quả sẽ là /blog/category/[tên_danh_mục]/page
    addRoutesFromGlob("src/routes/blog/category/*/page/+page.{svelte,md}");

    // "/blog/category/*/page/*"
    // Tìm các tệp +page trong src/routes/blog/category/[bất_kỳ_danh_mục]/page/[bất_kỳ_trang_con]/+page.{svelte,md}
    addRoutesFromGlob("src/routes/blog/category/*/page/*/+page.{svelte,md}");

    // "/blog/category/page/" (đường dẫn cụ thể, không có wildcard cho 'category')
    addRoutesFromGlob("src/routes/blog/category/page/+page.{svelte,md}");

    // "/blog/category/page/*"
    addRoutesFromGlob("src/routes/blog/category/page/*/+page.{svelte,md}");

    // "/blog/page/" (đường dẫn cụ thể)
    addRoutesFromGlob("src/routes/blog/page/+page.{svelte,md}");

    // "/blog/page/*"
    addRoutesFromGlob("src/routes/blog/page/*/+page.{svelte,md}");

    // Chuyển Set thành Array để SvelteKit sử dụng
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
        // Nếu bạn muốn kiểm soát dấu gạch chéo ở cuối URL (trailing slash)
        // Mặc định là 'never'. 'always' sẽ thêm / vào cuối.
        // 'ignore' sẽ không thay đổi gì.
        // trailingSlash: 'never',
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