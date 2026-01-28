const URL_POSTS = "http://localhost:3000/posts";
const URL_COMMENTS = "http://localhost:3000/comments";

// --- QUẢN LÝ POSTS ---

async function loadPosts() {
    let res = await fetch(URL_POSTS);
    let posts = await res.json();
    let body = document.getElementById("body_posts");
    body.innerHTML = "";

    posts.forEach(post => {
        const isDeleted = post.isDeleted;
        const rowClass = isDeleted ? 'class="row-deleted"' : '';
        const tag = isDeleted ? '<span class="status-tag tag-deleted">Đã xoá</span>' : '<span class="status-tag tag-active">Hoạt động</span>';
        
        body.innerHTML += `
            <tr ${rowClass}>
                <td>#${post.id}</td>
                <td>${tag}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>
                    <button class="btn-del" onclick="softDeletePost('${post.id}')" ${isDeleted ? 'disabled' : ''}>
                        Xoá mềm
                    </button>
                </td>
            </tr>
        `;
    });
}

async function savePost() {
    let title = document.getElementById("post_title").value;
    let views = document.getElementById("post_views").value;
    if(!title || !views) return alert("Vui lòng nhập đủ!");

    // Tự tăng ID dạng chuỗi
    let res = await fetch(URL_POSTS);
    let posts = await res.json();
    let maxId = posts.length > 0 ? Math.max(...posts.map(p => parseInt(p.id))) : 0;
    
    let newPost = {
        id: (maxId + 1).toString(),
        title: title,
        views: parseInt(views),
        isDeleted: false
    };

    await fetch(URL_POSTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
    });
    loadPosts();
}

async function softDeletePost(id) {
    // Chỉ cập nhật isDeleted: true
    if (confirm("Bạn có chắc muốn xoá bài viết này?")) {
        await fetch(`${URL_POSTS}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: true })
        });
        loadPosts();
    }
}

// --- QUẢN LÝ COMMENTS ---

async function loadComments() {
    let res = await fetch(URL_COMMENTS);
    let comments = await res.json();
    let body = document.getElementById("body_comments");
    body.innerHTML = "";

    comments.forEach(com => {
        body.innerHTML += `
            <tr>
                <td>${com.id}</td>
                <td>Post #${com.postId}</td>
                <td>${com.body}</td>
                <td><button class="btn-del" onclick="deleteComment('${com.id}')">Xoá</button></td>
            </tr>
        `;
    });
}

async function saveComment() {
    let pId = document.getElementById("com_postId").value;
    let text = document.getElementById("com_body").value;

    let res = await fetch(URL_COMMENTS);
    let comments = await res.json();
    let maxId = comments.length > 0 ? Math.max(...comments.map(c => parseInt(c.id))) : 0;

    await fetch(URL_COMMENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: (maxId + 1).toString(),
            postId: pId,
            body: text
        })
    });
    loadComments();
}

async function deleteComment(id) {
    await fetch(`${URL_COMMENTS}/${id}`, { method: 'DELETE' });
    loadComments();
}

loadPosts();
loadComments();