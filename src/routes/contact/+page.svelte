<script>
	import { createBubbler, preventDefault } from 'svelte/legacy';
	const bubble = createBubbler();
	import Callout from '$lib/components/Callout.svelte';
</script>

<svelte:head>
	<title>Liên hệ</title>
</svelte:head>

<h1>Liên hệ với tôi</h1>

<p>
	Xin chào, tôi là <strong>Cao Đức Trung</strong> – sinh viên ngành Công nghệ Thông tin tại Đại học Phenikaa. 
	Tôi là một lập trình viên đam mê với các công nghệ phần mềm và trí tuệ nhân tạo.
</p>

<p>
	Nếu bạn muốn kết nối hoặc trò chuyện về lập trình, AI hoặc các dự án cá nhân, hãy liên hệ qua một trong các kênh dưới đây:
</p>

<ul>
	<li>📧 <strong>Email:</strong> <a href="mailto:trungcaoduc2005@gmail.com">trungcaoduc2005@gmail.com</a></li>
	<li>📘 <strong>Facebook:</strong> <a href="https://www.facebook.com/trung.cao.2005/" target="_blank">Trung Cao</a></li>
	<li>🐱 <strong>GitHub:</strong> <a href="https://github.com/namnguyenit" target="_blank">namnguyenit</a></li>
</ul>

<Callout>Form dưới đây chỉ mang tính minh họa và không thực sự gửi dữ liệu.</Callout>

<form on:submit={preventDefault(bubble('submit'))}>
	<div class="form-section">
		<label for="name">Họ và tên</label>
		<input type="text" id="name" placeholder="Nhập họ tên của bạn" />
	</div>
	
	<div class="form-section">
		<label for="email">Email</label>
		<input type="email" id="email" placeholder="Nhập địa chỉ email" />
	</div>

	<div class="form-section">
		<label for="message">Nội dung liên hệ</label>
		<textarea id="message" rows="5" placeholder="Nhập nội dung bạn muốn gửi..."></textarea>
	</div>

	<input type="submit" value="Gửi (không thật)">
</form>
