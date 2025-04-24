var mySidebar = document.getElementById("mySidebar");
var overlayBg = document.getElementById("myOverlay");

// Biến theo dõi trạng thái trong Admin page
let adminState = 'top'; // 'top', 'left', 'layout', hoặc 'content'
let currentIndex = null; // Lưu index của navName hiện tại
let currentNavName = null; // Lưu navName hiện tại
let currentHeaderIndex = null; // Lưu headerIndex hiện tại
let currentContentRow = null; // Lưu tên hàng vừa click View (ví dụ: "Nội dung của ...")
let isHelpSection = false; // Biến để theo dõi trạng thái trang hướng dẫn

function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}

function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}

let navBar = document.querySelector('.w3-bar.w3-theme.w3-large');
let navLinks = navBar.querySelectorAll('a.w3-bar-item.w3-button');
let navNames = Array.from(navLinks)
  .map(link => link.textContent.trim().replace(/\s+/g, ' '))
  .filter(name => name !== '');
let sectionIds = ['info', 'web-tech', 'student-info', 'admin-page'];

console.log(">>> check navNames:", navNames);
console.log(">>> check sectionIds:", sectionIds);

function updateMenuTop() {
  const navBar = document.querySelector('.w3-bar.w3-theme.w3-large');
  let menuHTML = `
    <a class="w3-bar-item w3-button w3-right w3-hide-large w3-hover-white w3-large w3-theme-l1"
      href="javascript:void(0)" onclick="w3_open()"><i class="fa fa-bars"></i></a>
    <a href="#" onclick="showContent('courseInfo')" class="w3-bar-item w3-button">
      <i class="fas fa-home"></i>
    </a>
  `;
  navNames.forEach((name, index) => {
    if (index < navNames.length - 1) {
      const sectionId = sectionIds[index];
      menuHTML += `
        <a href="javascript:void(0)" onclick="showContent('${sectionId}')" class="w3-bar-item w3-button">${name}</a>
      `;
    }
  });
  menuHTML += `
    <a href="javascript:void(0)" onclick="showContent('admin-page')" class="w3-bar-item w3-button">Admin page</a>
  `;
  navBar.innerHTML = menuHTML;
}

// Hàm xử lý nút quay lại
function goBack() {
  if (adminState === 'content') {
    // Từ Admin contents quay về Admin contents layout
    const navtopInfo = document.getElementById('navtop-info');
    if (navtopInfo) {
      navtopInfo.style.display = 'block'; // Hiển thị lại navtop-info
    }
    viewSectionHeader(currentIndex, currentNavName, currentHeaderIndex);
  } else if (adminState === 'layout') {
    const navtopInfo = document.getElementById('navtop-info');
    if (navtopInfo) {
      navtopInfo.style.display = 'block'; // Hiển thị lại navtop-info
    }
    if (isHelpSection) {
      // Từ trang hướng dẫn quay về Admin contents layout
      isHelpSection = false; // Đặt lại trạng thái
      viewSectionHeader(currentIndex, currentNavName, currentHeaderIndex);
    } else {
      // Từ Admin contents layout quay về Admin menu left
      viewNavDetails(currentIndex, currentNavName);
    }
  } else if (adminState === 'left') {
    // Từ Admin menu left quay về Admin menu top
    const navtopInfo = document.getElementById('navtop-info');
    if (navtopInfo) {
      navtopInfo.style.display = 'block'; // Hiển thị lại navtop-info
    }
    adminState = 'top';
    showContent('admin-page');
    // Cập nhật tiêu đề thành "Admin menu top"
    const header = document.querySelector('#admin-page .header');
    if (header) {
      header.textContent = 'Admin menu top';
    }
  }
}

// Hàm hiển thị hoặc ẩn nút quay lại
function updateBackButton() {
  let backButton = document.getElementById('back-button');
  if (!backButton) {
    backButton = document.createElement('div');
    backButton.id = 'back-button';
    backButton.style.cssText = 'display: flex; justify-content: center; margin: 20px 0;';
    backButton.innerHTML = `
      <button onclick="goBack()" class="w3-button w3-theme" style="font-size: 18px;">
        <i class="fas fa-arrow-left"></i> Quay lại
      </button>
    `;
    // Thêm nút vào content-container, trước footer
    const contentContainer = document.getElementById('content-container');
    contentContainer.appendChild(backButton);
  }

  // Hiển thị hoặc ẩn nút dựa trên trạng thái
  if (adminState === 'left' || adminState === 'layout' || adminState === 'content') {
    backButton.style.display = 'flex';
  } else {
    backButton.style.display = 'none';
  }
}

//---------------------------ORA 2---------------------------//

//------------Xem, thêm, sửa, xóa của Admin menu top---------//
function editNavName(index) {
  const newName = prompt('Nhập tên mới cho mục điều hướng:', navNames[index]);
  if (newName && newName.trim() !== '') {
    navNames[index] = newName.trim();
    console.log(">>> check navNames:", navNames);
    adminState = 'top';
    showContent('admin-page');
    updateMenuTop();
  }
}

function deleteNavName(index) {
  const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa mục "${navNames[index]}" không?`);
  if (confirmDelete) {
    navNames.splice(index, 1);
    sectionIds.splice(index, 1);
    console.log(">>> check navNames after delete:", navNames);
    console.log(">>> check sectionIds after delete:", sectionIds);
    adminState = 'top';
    showContent('admin-page');
    updateMenuTop();
  }
}

function addNavName(index) {
  const newName = prompt('Nhập tên mục điều hướng mới:');
  if (newName && newName.trim() !== '') {
    const newSectionId = prompt('Nhập sectionId cho mục mới (ví dụ: info, web-tech, student-info):');
    if (newSectionId && newSectionId.trim() !== '') {
      const position = index === -1 ? 0 : index + 1;
      navNames.splice(position, 0, newName.trim());
      sectionIds.splice(position, 0, newSectionId.trim());
      console.log(">>> check navNames after add:", navNames);
      console.log(">>> check sectionIds after add:", sectionIds);

      // Tạo section mới trong DOM
      const newSection = document.createElement('div');
      newSection.id = newSectionId.trim();
      newSection.className = 'w3-container w3-padding-64 hidden';
      newSection.innerHTML = `
        <div class="container">
          <div class="header">${newName.trim()}</div>
          <p>Đây là nội dung mặc định cho ${newName.trim()}. Bạn có thể chỉnh sửa nội dung này trong Admin contents layout.</p>
        </div>
      `;
      document.getElementById('content-container').appendChild(newSection);

      adminState = 'top';
      showContent('admin-page');
      updateMenuTop();
    } else {
      alert('SectionId không được để trống!');
    }
  } else {
    alert('Tên mục không được để trống!');
  }
}

// Hàm reset nội dung của section "student-info"
function resetSectionContent(index, navName) {
  const sectionId = index === -1 ? 'courseInfo' : sectionIds[index];
  const section = document.getElementById(sectionId);

  // Xóa toàn bộ nội dung hiện tại trong section
  const container = section.querySelector('.container');
  if (container) {
    // Giữ lại thẻ header
    const header = container.querySelector('.header');
    container.innerHTML = '';
    container.appendChild(header);
  }

  // Khởi tạo lại các mục ban đầu với nội dung cụ thể
  const initialHeaders = [
    {
      text: 'CV',
      id: 'cv-header',
      content: `
        <div class="content">
          <div class="section-contents" id="cv-name" data-name="Họ và tên">
            <p><strong>Họ tên:</strong> Nguyễn Thế Anh</p>
          </div>
          <div class="section-contents" id="cv-mssv" data-name="MSSV">
            <p><strong>Mã số SV:</strong> 20224920</p>
          </div>
          <div class="section-contents" id="cv-image" data-name="Ảnh của sinh viên">
            <img src="./assets/ava.jpg" alt="Ảnh sinh viên" style="max-width: 200px; height: auto;">
          </div>
        </div>
      `
    },
    {
      text: 'Các dự án đã tham gia',
      id: 'projects-header',
      content: `
        <div class="content">
          <div class="section-contents" id="project-1" data-name="Dự án 1">
            <strong>Dự án 1: Website bán quần áo nam - Fashionista</strong>
            <p>Số lượng người tham gia: 5</p>
            <p>Thời gian: 10/2024 - 12/2024</p>
            <p>Công nghệ sử dụng: ExpressJS, ReactJS, PostgreSQL</p>
            <p>Mô tả: Website quản lý bán hàng thời trang nam. Trang web phân quyền giữa người 
dùng và admin: người dùng có thể đặt mua hàng, còn admin có thể quản lý kho 
và doanh thu của mình. </p>
            <p> Mô tả trách nhiệm: Thiết kế quản lý cơ sở dữ liệu, xây dựng API cho frontend, xác thực và phân 
quyền người dùng </p>
          </div>
          <div class="section-contents" id="project-2" data-name="Dự án 2">
            <strong>Dự án 2: Trang web đặt lịch giữa học sinh và giáo viên - Appointment website</strong>
            <p>Dự án cá nhân</p>
            <p>Thời gian: 12/2024 - 01/2025</p>
            <p>Công nghệ sử dụng: ExpressJS, ReactJS, PostgreSQL</p>
            <p>Mô tả: Website đặt lịch hẹn giữa giáo viên và học sinh. Học sinh đặt những lịch rảnh 
của giáo viên, giáo viên có quyền chấp nhận/hủy yêu cầu đó</p>
            <p>Mô tả trách nhiệm: Thiết kế quản lý cơ sở dữ liệu, xây dựng API cho frontend, xác thực và phân 
quyền người dùng</p>
          </div>
        </div>
      `
    },
    {
      text: 'Sinh hoạt cộng đồng',
      id: 'community-header',
      content: `
        <div class="content">
          <div class="section-contents" id="community-1" data-name="Hiến máu nhân đạo">
            <strong>Hiến máu nhân đạo</strong>
            <p>Mô tả: Tham gia chương trình hiến máu nhân đạo tại Đại học Bách Khoa Hà Nội.</p>
            <p>Thời gian: 03/2024</p>
          </div>
          <div class="section-contents" id="community-2" data-name="Mùa hè xanh">
            <strong>Mùa hè xanh</strong>
            <p>Mô tả: Tham gia chiến dịch tình nguyện Mùa hè xanh.</p>
            <p>Thời gian: 07/2024</p>
          </div>
        </div>
      `
    }
  ];

  initialHeaders.forEach(headerData => {
    const newHeader = document.createElement('div');
    newHeader.className = 'section-header';
    newHeader.id = headerData.id;
    newHeader.style.marginTop = '20px';
    newHeader.textContent = headerData.text;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    contentDiv.innerHTML = headerData.content;

    container.appendChild(newHeader);
    container.appendChild(contentDiv);
  });

  // Cập nhật lại giao diện
  viewNavDetails(index, navName);
}

function viewNavDetails(index, navName) {
  const sectionId = index === -1 ? 'courseInfo' : sectionIds[index];
  const section = document.getElementById(sectionId);
  const sectionHeaders = section.querySelectorAll('.section-header');
  console.log(">>> Section headers after update:", sectionHeaders.length, Array.from(sectionHeaders).map(h => h.textContent.trim()));
  const headersData = Array.from(sectionHeaders).map(header => ({
    id: header.id,
    text: header.textContent.trim()
  }));
  const header = document.querySelector('#admin-page .header');
  // Thêm icon reset chỉ khi navName là "Thông tin sinh viên"
  if (navName === 'Thông tin sinh viên') {
    header.innerHTML = `
      Admin menu left: ${navName}
      <i class="fas fa-undo" style="margin-left: 10px; cursor: pointer;" title="Reset" onclick="resetSectionContent(${index}, '${navName}')"></i>
    `;
  } else {
    header.innerHTML = `Admin menu left: ${navName}`;
  }
  const navtopInfo = document.getElementById('navtop-info');
  if (navtopInfo) {
    navtopInfo.style.display = 'block'; // Đảm bảo navtop-info hiển thị
  }
  const navtopHeader = document.querySelector('#navtop-info .section-header');
  navtopHeader.textContent = 'Các nội dung chính';
  const tableContainer = document.getElementById('admin-menu-table');
  let tableHTML = `
    <table class="table-info">
      <thead>
        <tr>
          <th>Nội dung</th>
          <th>Các thao tác</th>
        </tr>
      </thead>
      <tbody>
  `;
  if (headersData.length === 0) {
    // Nếu không có section-header, hiển thị một hàng với icon "+"
    tableHTML += `
      <tr>
        <td>Không có nội dung</td>
        <td>
          <i class="fas fa-plus" style="margin-right: 10px; cursor: pointer;" title="Thêm nội dung mới" onclick="addSectionHeader(${index}, '${navName}', -1)"></i>
        </td>
      </tr>
    `;
  } else {
    headersData.forEach((header, idx) => {
      tableHTML += `
        <tr>
          <td>${normalizeString(header.text)}</td>
          <td>
            <i class="fas fa-eye" style="margin-right: 10px; cursor: pointer;" title="View" onclick="viewSectionHeader(${index}, '${navName}', ${idx})"></i>
            <i class="fas fa-pencil-alt" style="margin-right: 10px; cursor: pointer;" title="Edit" onclick="editSectionHeader(${index}, '${navName}', ${idx})"></i>
            <i class="fas fa-times" style="margin-right: 10px; cursor: pointer;" title="Delete" onclick="deleteSectionHeader(${index}, '${navName}', ${idx})"></i>
            <i class="fas fa-plus" style="margin-right: 10px; cursor: pointer;" title="Thêm hàng mới" onclick="addSectionHeader(${index}, '${navName}', ${idx})"></i>
          </td>
        </tr>
      `;
    });
  }
  tableHTML += `
      </tbody>
    </table>
  `;
  tableContainer.innerHTML = tableHTML;
  let sidebarContent = `
    <h4 class="w3-bar-item"><b>${navName}</b></h4>
  `;
  headersData.forEach(header => {
    sidebarContent += `
      <a class="w3-bar-item w3-button w3-hover-black" href="#${header.id}">${normalizeString(header.text)}</a>
    `;
  });
  mySidebar.innerHTML = sidebarContent;

  // Cập nhật trạng thái và hiển thị nút quay lại
  adminState = 'left';
  currentIndex = index;
  currentNavName = navName;
  currentHeaderIndex = null;
  updateBackButton();
}

//------------Xem, thêm, sửa, xóa của Admin menu left--------//
function normalizeString(str) {
  return str.trim().replace(/\s+/g, ' ');
}

function editSectionHeader(index, navName, headerIndex) {
  const sectionId = index === -1 ? 'courseInfo' : sectionIds[index];
  const section = document.getElementById(sectionId);
  const sectionHeaders = section.querySelectorAll('.section-header');
  const headersData = Array.from(sectionHeaders).map(header => ({
    id: header.id,
    text: header.textContent.trim()
  }));
  const normalizedText = normalizeString(headersData[headerIndex].text);
  const newHeaderText = prompt('Nhập tên mới cho nội dung:', normalizedText);
  if (newHeaderText && newHeaderText.trim() !== '') {
    const normalizedNewText = normalizeString(newHeaderText);
    sectionHeaders[headerIndex].textContent = normalizedNewText;
    viewNavDetails(index, navName);
  }
}

function deleteSectionHeader(index, navName, headerIndex) {
  const sectionId = index === -1 ? 'courseInfo' : sectionIds[index];
  const section = document.getElementById(sectionId);
  const sectionHeaders = section.querySelectorAll('.section-header');
  const headersData = Array.from(sectionHeaders).map(header => ({
    id: header.id,
    text: header.textContent.trim()
  }));
  console.log(">>> check headersData:", headersData);
  console.log(">>> check headersData[headerIndex].id:", headersData[headerIndex].id);
  const normalizedText = normalizeString(headersData[headerIndex].text);
  const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa nội dung "${normalizedText}" không?`);
  if (confirmDelete) {
    const headerId = headersData[headerIndex].id;
    if (!headerId) {
      console.error(">>> Error: headerId is empty or undefined for index", headerIndex);
      alert("Không thể xóa: Phần tử không có ID hợp lệ.");
      return;
    }
    const headerElement = document.getElementById(headerId);
    console.log(">>> check headerElement:", headerElement);
    if (headerElement) {
      headerElement.remove();
      setTimeout(() => {
        viewNavDetails(index, navName);
      }, 0);
    } else {
      console.error(">>> Error: Could not find element with ID", headerId);
      alert("Không thể xóa: Không tìm thấy phần tử với ID " + headerId);
    }
  }
}

function addSectionHeader(index, navName, headerIndex) {
  const sectionId = index === -1 ? 'courseInfo' : sectionIds[index];
  const section = document.getElementById(sectionId);
  const sectionHeaders = section.querySelectorAll('.section-header');

  const newHeaderText = prompt('Nhập tên mới cho section-header:');
  if (newHeaderText && newHeaderText.trim() !== '') {
    const normalizedNewText = normalizeString(newHeaderText);
    const newHeader = document.createElement('div');
    newHeader.className = 'section-header';
    const uniqueId = `header-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    newHeader.id = uniqueId;
    newHeader.textContent = normalizedNewText;
    newHeader.style.marginTop = '20px';

    // Thêm một phần tử nội dung mặc định (rỗng) ngay sau section-header mới
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    contentDiv.innerHTML = ''; // Nội dung rỗng

    if (headerIndex === -1) {
      // Nếu không có section-header, thêm vào container
      const container = section.querySelector('.container');
      container.appendChild(newHeader);
      container.appendChild(contentDiv);
    } else if (headerIndex < sectionHeaders.length - 1) {
      const nextHeader = sectionHeaders[headerIndex + 1];
      nextHeader.parentNode.insertBefore(newHeader, nextHeader);
      newHeader.parentNode.insertBefore(contentDiv, nextHeader);
    } else {
      sectionHeaders[headerIndex].parentNode.appendChild(newHeader);
      sectionHeaders[headerIndex].parentNode.appendChild(contentDiv);
    }

    setTimeout(() => {
      viewNavDetails(index, navName);
    }, 0);
  } else {
    alert('Tên section-header không được để trống!');
  }
}

// Hàm để hiển thị trang hướng dẫn
function showHelpSection(index, navName, headerIndex) {
  const helpHeaderText = 'Hướng dẫn thiết lập nội dung';
  const helpSectionHeaderText = 'Nội dung hướng dẫn';
  const sectionHeaderId = `help-header-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Cập nhật tiêu đề
  const header = document.querySelector('#admin-page .header');
  header.textContent = helpHeaderText;

  // Ẩn phần navtop-info để không hiển thị "Các mục điều hướng"
  const navtopInfo = document.getElementById('navtop-info');
  if (navtopInfo) {
    navtopInfo.style.display = 'none';
  }

  // Tạo nội dung trang hướng dẫn
  const tableContainer = document.getElementById('admin-menu-table');
  let helpHTML = `
    <div class="section-header" id="${sectionHeaderId}" style="margin-top: 20px;">
      ${helpSectionHeaderText}
    </div>
    <div class="content">
      <p>Dưới đây là hướng dẫn để chỉnh sửa nội dung</p>
      <p><strong>Các bước thực hiện:</strong></p>
      <ol>
        <li>Bấm vào biểu tượng "view" để hiện thị textarea tương ứng với Admin contents đó</li>
        <li>Nhập đoạn code HTML vào textarea để thay đổi nội dung mục contents</li>
        <li>Khi thao tác chỉnh sửa, yêu cầu cập nhật hiển thị ngay preview mục contents ở bên dưới</li>
      </ol>
      <p><strong>Chú thích:</strong></p>
      <ul>
        <li>Biểu tượng "view": Dùng để xem chi tiết nội dung và chỉnh sửa</li>
        <li>Biểu tượng "edit": Dùng để chỉnh sửa tên của mục đó</li>
        <li>Biểu tượng "xóa": Dùng để xóa nội dung đó trong Admin menu left</li>
      </ul>
    </div>
  `;
  tableContainer.innerHTML = helpHTML;

  // Cập nhật sidebar
  let sidebarContent = `
    <h4 class="w3-bar-item"><b>${helpHeaderText}</b></h4>
    <a class="w3-bar-item w3-button w3-hover-black active" href="#${sectionHeaderId}">${helpSectionHeaderText}</a>
  `;
  mySidebar.innerHTML = sidebarContent;

  // Cập nhật trạng thái và hiển thị nút quay lại
  adminState = 'layout';
  isHelpSection = true; // Đánh dấu đang ở trang hướng dẫn
  currentIndex = index;
  currentNavName = navName;
  currentHeaderIndex = headerIndex;
  updateBackButton();
}

// Hàm để thêm mục con (Họ và tên, MSSV, Dự án 1, Dự án 2,...) trong các section-header
function addSubSection(index, navName, headerIndex, subSectionIndex) {
  const sectionId = index === -1 ? 'courseInfo' : sectionIds[index];
  const section = document.getElementById(sectionId);
  const sectionHeaders = section.querySelectorAll('.section-header');
  const headerElement = sectionHeaders[headerIndex];
  const parentDiv = headerElement.parentElement;
  const normalizedHeaderText = normalizeString(headerElement.textContent);

  let promptText = 'Nhập tên mới cho mục con:';
  if (normalizedHeaderText === 'CV') {
    promptText = 'Nhập tên mới cho mục con (ví dụ: Họ và tên, MSSV):';
  } else if (normalizedHeaderText === 'Các dự án đã tham gia') {
    promptText = 'Nhập tên mới cho mục con (ví dụ: Dự án 1, Dự án 2):';
  } else if (normalizedHeaderText === 'Sinh hoạt cộng đồng') {
    promptText = 'Nhập tên mới cho mục con (ví dụ: Hiến máu nhân đạo, Mùa hè xanh):';
  }

  const newSubSectionText = prompt(promptText);
  if (newSubSectionText && newSubSectionText.trim() !== '') {
    const normalizedNewText = normalizeString(newSubSectionText);

    // Tìm hoặc tạo contentDiv
    let contentDiv = parentDiv.querySelector('.content');
    if (!contentDiv) {
      contentDiv = document.createElement('div');
      contentDiv.className = 'content';
      // Chèn contentDiv ngay sau headerElement
      if (headerElement.nextElementSibling) {
        parentDiv.insertBefore(contentDiv, headerElement.nextElementSibling);
      } else {
        parentDiv.appendChild(contentDiv);
      }
    }

    const newContent = document.createElement('div');
    newContent.className = 'section-contents';
    const uniqueId = `${normalizedHeaderText.toLowerCase().replace(/\s+/g, '-')}-${normalizedNewText.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    newContent.id = uniqueId;
    newContent.setAttribute('data-name', normalizedNewText);
    newContent.innerHTML = `<p><strong>${normalizedNewText}</strong>: Nội dung mặc định</p>`;

    // Lấy danh sách các section-contents trực tiếp từ contentDiv
    const existingSubContents = contentDiv.querySelectorAll('.section-contents');

    // Tìm phần tử hiện tại (dựa trên subSectionIndex) và chèn ngay sau nó
    const currentSubContent = existingSubContents[subSectionIndex];
    if (currentSubContent && currentSubContent.parentElement === contentDiv) {
      // Chèn ngay sau currentSubContent
      if (currentSubContent.nextElementSibling) {
        contentDiv.insertBefore(newContent, currentSubContent.nextElementSibling);
      } else {
        contentDiv.appendChild(newContent);
      }
    } else {
      // Nếu không tìm thấy currentSubContent, thêm vào cuối contentDiv
      contentDiv.appendChild(newContent);
    }

    setTimeout(() => {
      viewSectionHeader(index, navName, headerIndex);
    }, 0);
  } else {
    alert('Tên mục con không được để trống!');
  }
}

// Hàm để xóa mục con trong các section-header
function deleteSubSection(index, navName, headerIndex, subSectionIndex) {
  const sectionId = index === -1 ? 'courseInfo' : sectionIds[index];
  const section = document.getElementById(sectionId);
  const sectionHeaders = section.querySelectorAll('.section-header');
  const headerElement = sectionHeaders[headerIndex];
  const parentDiv = headerElement.parentElement;
  const contentDiv = parentDiv.querySelector('.content');
  const subContents = contentDiv.querySelectorAll('.section-contents');

  const subSectionName = subContents[subSectionIndex].getAttribute('data-name');
  const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa mục "${subSectionName}" không?`);
  if (confirmDelete) {
    subContents[subSectionIndex].remove();
    setTimeout(() => {
      viewSectionHeader(index, navName, headerIndex);
    }, 0);
  }
}

// Hàm để chỉnh sửa tên mục con trong các section-header
function editSubSection(index, navName, headerIndex, subSectionIndex) {
  const sectionId = index === -1 ? 'courseInfo' : sectionIds[index];
  const section = document.getElementById(sectionId);
  const sectionHeaders = section.querySelectorAll('.section-header');
  const headerElement = sectionHeaders[headerIndex];
  const parentDiv = headerElement.parentElement;
  const contentDiv = parentDiv.querySelector('.content');
  const subContents = contentDiv.querySelectorAll('.section-contents');

  const subSectionName = subContents[subSectionIndex].getAttribute('data-name');
  const newSubSectionText = prompt('Nhập tên mới cho mục:', subSectionName);
  if (newSubSectionText && newSubSectionText.trim() !== '') {
    const normalizedNewText = normalizeString(newSubSectionText);
    subContents[subSectionIndex].setAttribute('data-name', normalizedNewText);
    const normalizedHeaderText = normalizeString(headerElement.textContent);
    const uniqueId = `${normalizedHeaderText.toLowerCase().replace(/\s+/g, '-')}-${normalizedNewText.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    subContents[subSectionIndex].id = uniqueId;
    const pTag = subContents[subSectionIndex].querySelector('p');
    if (pTag) {
      pTag.innerHTML = `<strong>${normalizedNewText}</strong>: ${pTag.textContent.split(':')[1].trim()}`;
    }
    setTimeout(() => {
      viewSectionHeader(index, navName, headerIndex);
    }, 0);
  }
}

// Hàm để hiển thị giao diện Admin contents khi click View
function viewContentDetails(index, navName, headerIndex, contentRow) {
  const sectionId = index === -1 ? 'courseInfo' : sectionIds[index];
  const section = document.getElementById(sectionId);
  const sectionHeaders = section.querySelectorAll('.section-header');
  const headersData = Array.from(sectionHeaders).map(header => ({
    id: header.id,
    text: header.textContent.trim()
  }));
  const selectedHeader = headersData[headerIndex];
  const normalizedText = normalizeString(selectedHeader.text);

  // Tìm div cha của section-header
  const headerElement = sectionHeaders[headerIndex];
  const parentDiv = headerElement.parentElement;

  let contentHTML = '';
  if (navName === 'Thông tin sinh viên' && ['CV', 'Các dự án đã tham gia', 'Sinh hoạt cộng đồng'].includes(normalizedText)) {
    const contentDiv = parentDiv.querySelector('.content');
    const subContents = contentDiv.querySelectorAll('.section-contents');
    const subContent = Array.from(subContents).find(sc => sc.getAttribute('data-name') === contentRow);
    if (subContent) {
      // Lấy nội dung HTML bên trong subContent
      contentHTML = subContent.innerHTML.trim();
    } else {
      // Nếu không tìm thấy subContent, hiển thị nội dung mặc định
      contentHTML = `<p><strong>${contentRow}</strong>: Nội dung mặc định</p>`;
    }
  } else {
    const childElements = Array.from(parentDiv.children);
    childElements.forEach(child => {
      if (!child.classList.contains('section-header')) {
        contentHTML += child.outerHTML || '';
      }
    });
  }

  // Nếu không có nội dung, hiển thị placeholder
  if (!contentHTML.trim()) {
    contentHTML = '<p>Không có nội dung để hiển thị.</p>';
  }

  // Cập nhật tiêu đề
  const header = document.querySelector('#admin-page .header');
  header.textContent = `Admin contents: ${navName}/${normalizedText}/${contentRow}`;

  // Hiển thị lại navtop-info và đổi section-header
  const navtopInfo = document.getElementById('navtop-info');
  if (navtopInfo) {
    navtopInfo.style.display = 'block';
  }
  const navtopHeader = document.querySelector('#navtop-info .section-header');
  navtopHeader.textContent = 'Nội dung HTML';

  // Tạo textarea và preview
  const tableContainer = document.getElementById('admin-menu-table');
  let contentHTMLDisplay = contentHTML;
  // Nếu nội dung là placeholder "Không có nội dung để hiển thị", đặt textarea rỗng
  if (contentHTML === '<p>Không có nội dung để hiển thị.</p>') {
    contentHTMLDisplay = '';
  }
  let previewHTML = `
    <textarea id="content-textarea" style="width: 100%; min-height: 300px; padding: 10px; font-family: monospace; resize: vertical;">${contentHTMLDisplay}</textarea>
    <div class="section-header" style="margin-top: 20px;">
      Preview ${contentRow}
    </div>
    <div id="content-preview" style="border: 1px solid #ccc; padding: 10px; min-height: 100px; background-color: #f9f9f9;">
      ${contentHTMLDisplay}
    </div>
  `;
  tableContainer.innerHTML = previewHTML;

  // Thêm sự kiện input để cập nhật preview và lưu nội dung vào DOM
  const textarea = document.getElementById('content-textarea');
  const previewDiv = document.getElementById('content-preview');
  textarea.addEventListener('input', () => {
    const newContent = textarea.value || '<p>Không có nội dung để hiển thị.</p>';
    previewDiv.innerHTML = newContent;

    // Cập nhật nội dung vào DOM của section
    if (navName === 'Thông tin sinh viên' && ['CV', 'Các dự án đã tham gia', 'Sinh hoạt cộng đồng'].includes(normalizedText)) {
      const contentDiv = parentDiv.querySelector('.content');
      const subContents = contentDiv.querySelectorAll('.section-contents');
      const subContent = Array.from(subContents).find(sc => sc.getAttribute('data-name') === contentRow);
      if (subContent) {
        subContent.innerHTML = newContent;
      } else {
        const newSubContent = document.createElement('div');
        newSubContent.className = 'section-contents';
        const uniqueId = `${normalizedText.toLowerCase().replace(/\s+/g, '-')}-${contentRow.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        newSubContent.id = uniqueId;
        newSubContent.setAttribute('data-name', contentRow);
        newSubContent.innerHTML = newContent;
        contentDiv.appendChild(newSubContent);
      }
    } else {
      let contentElement = headerElement.nextElementSibling;
      while (contentElement && contentElement.classList.contains('section-header')) {
        contentElement = contentElement.nextElementSibling;
      }
      if (contentElement && contentElement.classList.contains('content')) {
        contentElement.innerHTML = newContent;
      } else {
        const newContentDiv = document.createElement('div');
        newContentDiv.className = 'content';
        newContentDiv.innerHTML = newContent;
        parentDiv.insertBefore(newContentDiv, headerElement.nextElementSibling);
      }
    }
  });

  // Cập nhật trạng thái và hiển thị nút quay lại
  adminState = 'content';
  currentIndex = index;
  currentNavName = navName;
  currentHeaderIndex = headerIndex;
  currentContentRow = contentRow;
  updateBackButton();
}

function viewSectionHeader(index, navName, headerIndex) {
  const sectionId = index === -1 ? 'courseInfo' : sectionIds[index];
  const section = document.getElementById(sectionId);
  const sectionHeaders = section.querySelectorAll('.section-header');
  const headersData = Array.from(sectionHeaders).map(header => ({
    id: header.id,
    text: header.textContent.trim()
  }));
  const selectedHeader = headersData[headerIndex];
  const normalizedText = normalizeString(selectedHeader.text);

  // Lấy nội dung thực tế ngay sau section-header
  const headerElement = sectionHeaders[headerIndex];
  let contentElement = headerElement.nextElementSibling;
  let contentHTML = '<p>Không có nội dung để hiển thị.</p>';

  // Tìm phần tử nội dung hợp lệ (không phải section-header)
  while (contentElement && contentElement.classList.contains('section-header')) {
    contentElement = contentElement.nextElementSibling;
  }

  // Nếu contentElement tồn tại và không phải section-header, lấy nội dung
  if (contentElement && !contentElement.classList.contains('section-header')) {
    contentHTML = contentElement.innerHTML || '<p>Không có nội dung để hiển thị.</p>';
  }

  // Kiểm tra xem nội dung có rỗng không
  const isContentEmpty = !contentElement || !contentElement.innerHTML.trim() || contentHTML === '<p>Không có nội dung để hiển thị.</p>';

  // Kiểm tra xem nội dung có thẻ <img> hay không
  const hasImage = contentElement && contentElement.querySelector('img') !== null;

  // Cập nhật tiêu đề
  const header = document.querySelector('#admin-page .header');
  header.textContent = `Admin contents layout: ${navName}/${normalizedText}`;

  // Hiển thị lại navtop-info nếu cần
  const navtopInfo = document.getElementById('navtop-info');
  if (navtopInfo) {
    navtopInfo.style.display = 'block';
  }
  const navtopHeader = document.querySelector('#navtop-info .section-header');
  navtopHeader.textContent = 'Các nội dung chính';

  // Tạo bảng chính (Admin contents layout)
  const tableContainer = document.getElementById('admin-menu-table');
  let tableHTML = `
    <table class="table-info">
      <thead>
        <tr>
          <th>Nội dung</th>
          <th>Các thao tác</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Xử lý đặc biệt cho "Thông tin sinh viên" với "CV", "Các dự án đã tham gia", và "Sinh hoạt cộng đồng"
  if (navName === 'Thông tin sinh viên' && ['CV', 'Các dự án đã tham gia', 'Sinh hoạt cộng đồng'].includes(normalizedText)) {
    const contentDiv = contentElement;
    let subContents = contentDiv.querySelectorAll('.section-contents');
    let subSections = Array.from(subContents).map(sc => sc.getAttribute('data-name'));

    // Nếu không có subContents, khởi tạo mặc định
    if (subSections.length === 0) {
      let defaultSubSections = [];
      if (normalizedText === 'CV') {
        defaultSubSections = [
          { name: 'Họ và tên', content: '<p><strong>Họ tên:</strong> Nguyễn Thế Anh</p>', id: 'cv-name' },
          { name: 'MSSV', content: '<p><strong>Mã số SV:</strong> 20224920</p>', id: 'cv-mssv' },
          { name: 'Ảnh của sinh viên', content: '<img src="./assets/ava.jpg" alt="Ảnh sinh viên" style="max-width: 200px; height: auto;">', id: 'cv-image' }
        ];
      } else if (normalizedText === 'Các dự án đã tham gia') {
        defaultSubSections = [
          { name: 'Dự án 1', content: '<strong>Dự án 1: Website bán quần áo nam - Fashionista</strong><p>Số lượng người tham gia: 5</p><p>Thời gian: 10/2024 - 12/2024</p><p>Công nghệ sử dụng: ExpressJS, ReactJS, PostgreSQL</p><p>Mô tả: Website quản lý bán hàng thời trang nam. Trang web phân quyền giữa người dùng và admin: người dùng có thể đặt mua hàng, còn admin có thể quản lý kho và doanh thu của mình.</p><p>Mô tả trách nhiệm: Thiết kế quản lý cơ sở dữ liệu, xây dựng API cho frontend, xác thực và phân quyền người dùng</p>', id: 'project-1' },
          { name: 'Dự án 2', content: '<strong>Dự án 2: Trang web đặt lịch giữa học sinh và giáo viên - Appointment website</strong><p>Dự án cá nhân</p><p>Thời gian: 12/2024 - 01/2025</p><p>Công nghệ sử dụng: ExpressJS, ReactJS, PostgreSQL</p><p>Mô tả: Website đặt lịch hẹn giữa giáo viên và học sinh. Học sinh đặt những lịch rảnh của giáo viên, giáo viên có quyền chấp nhận/hủy yêu cầu đó</p><p>Mô tả trách nhiệm: Thiết kế quản lý cơ sở dữ liệu, xây dựng API cho frontend, xác thực và phân quyền người dùng</p>', id: 'project-2' }
        ];
      } else if (normalizedText === 'Sinh hoạt cộng đồng') {
        defaultSubSections = [
          { name: 'Hiến máu nhân đạo', content: '<strong>Hiến máu nhân đạo</strong><p>Mô tả: Tham gia chương trình hiến máu nhân đạo tại Đại học Bách Khoa Hà Nội.</p><p>Thời gian: 03/2024</p>', id: 'community-1' },
          { name: 'Mùa hè xanh', content: '<strong>Mùa hè xanh</strong><p>Mô tả: Tham gia chiến dịch tình nguyện Mùa hè xanh.</p><p>Thời gian: 07/2024</p>', id: 'community-2' }
        ];
      }
      defaultSubSections.forEach(sub => {
        const newSubContent = document.createElement('div');
        newSubContent.className = 'section-contents';
        newSubContent.id = sub.id;
        newSubContent.setAttribute('data-name', sub.name);
        newSubContent.innerHTML = sub.content;
        contentDiv.appendChild(newSubContent);
      });
      subContents = contentDiv.querySelectorAll('.section-contents');
      subSections = defaultSubSections.map(sub => sub.name);
    }

    subSections.forEach((subSection, idx) => {
      tableHTML += `
        <tr>
          <td>${subSection}</td>
          <td>
            <i class="fas fa-eye" style="margin-right: 10px; cursor: pointer;" title="View" onclick="viewContentDetails(${index}, '${navName}', ${headerIndex}, '${subSection}')"></i>
            <i class="fas fa-pencil-alt" style="margin-right: 10px; cursor: pointer;" title="Edit" onclick="editSubSection(${index}, '${navName}', ${headerIndex}, ${idx})"></i>
            <i class="fas fa-times" style="margin-right: 10px; cursor: pointer;" title="Delete" onclick="deleteSubSection(${index}, '${navName}', ${headerIndex}, ${idx})"></i>
            <i class="fas fa-plus" style="margin-right: 10px; cursor: pointer;" title="Add" onclick="addSubSection(${index}, '${navName}', ${headerIndex}, ${idx})"></i>
            <i class="fas fa-info-circle" style="margin-right: 10px; cursor: pointer;" title="Hướng dẫn" onclick="showHelpSection(${index}, '${navName}', ${headerIndex})"></i>
          </td>
        </tr>
      `;
    });
  } else {
    tableHTML += `
      <tr>
        <td>Nội dung của ${normalizedText}</td>
        <td>
          <i class="fas fa-eye" style="margin-right: 10px; cursor: pointer;" title="View" onclick="viewContentDetails(${index}, '${navName}', ${headerIndex}, 'Nội dung của ${normalizedText}')"></i>
          <i class="fas fa-pencil-alt" style="margin-right: 10px; cursor: pointer;" title="Edit" onclick="editSectionHeader(${index}, '${navName}', ${headerIndex})"></i>
          <i class="fas fa-times" style="margin-right: 10px; cursor: pointer;" title="Delete" onclick="deleteSectionHeader(${index}, '${navName}', ${headerIndex})"></i>
          <i class="fas fa-info-circle" style="margin-right: 10px; cursor: pointer;" title="Hướng dẫn" onclick="showHelpSection(${index}, '${navName}', ${headerIndex})"></i>
        </td>
      </tr>
    `;

    if (hasImage) {
      tableHTML += `
        <tr>
          <td>Ảnh của ${normalizedText}</td>
          <td>
            <i class="fas fa-eye" style="margin-right: 10px; cursor: pointer;" title="View" onclick="viewContentDetails(${index}, '${navName}', ${headerIndex}, 'Ảnh của ${normalizedText}')"></i>
            <i class="fas fa-pencil-alt" style="margin-right: 10px; cursor: pointer;" title="Edit" onclick="editSectionHeader(${index}, '${navName}', ${headerIndex})"></i>
            <i class="fas fa-times" style="margin-right: 10px; cursor: pointer;" title="Delete" onclick="deleteSectionHeader(${index}, '${navName}', ${headerIndex})"></i>
            <i class="fas fa-info-circle" style="margin-right: 10px; cursor: pointer;" title="Hướng dẫn" onclick="showHelpSection(${index}, '${navName}', ${headerIndex})"></i>
          </td>
        </tr>
      `;
    }
  }

  // Đóng thẻ bảng Admin contents layout
  tableHTML += `
      </tbody>
    </table>
  `;

  // Tạo bảng preview với bố cục động
  let previewHTML = '';
  if (navName === 'Thông tin sinh viên' && normalizedText === 'CV') {
    const subContents = contentElement.querySelectorAll('.section-contents');
    const nonImageContents = Array.from(subContents).filter(sc => sc.getAttribute('data-name') !== 'Ảnh của sinh viên');
    const imageContent = Array.from(subContents).find(sc => sc.getAttribute('data-name') === 'Ảnh của sinh viên');
    const rowCount = nonImageContents.length;

    // Tạo grid-template-rows động, thêm 1 hàng cho "Thông tin CV"
    const rowTemplate = Array(rowCount + 1).fill('1fr').join(' ');

    previewHTML = `
      <div style="margin-top: 60px; display: grid; grid-template-columns: 9fr 5fr; grid-template-rows: ${rowTemplate}; gap: 1px; border: 1px solid black; background-color: black;">
        <div style="grid-column: 1 / -1; grid-row: 1 / 2; background-color: #ffcc33; padding: 10px;">
          <h3 style="margin: 0; font-size: 16px; color: white; font-weight: bold;">Thông tin CV</h3>
        </div>
    `;
    nonImageContents.forEach((subContent, idx) => {
      const subName = subContent.getAttribute('data-name');
      previewHTML += `
        <div style="grid-column: 1 / 2; grid-row: ${idx + 2} / ${idx + 3}; background-color: #f9f9f9; padding: 10px;">
          <p style="margin: 0;">${subName}${isContentEmpty ? ': Đang rỗng' : ''}</p>
        </div>
      `;
    });
    if (imageContent) {
      previewHTML += `
        <div style="grid-column: 2 / 3; grid-row: 2 / ${rowCount + 2}; background-color: #f9f9f9; padding: 10px;">
          <p style="margin: 0;">Ảnh của sinh viên</p>
        </div>
      `;
    }
    previewHTML += `
      </div>
    `;
  } else if (navName === 'Thông tin sinh viên' && ['Các dự án đã tham gia', 'Sinh hoạt cộng đồng'].includes(normalizedText)) {
    const subContents = contentElement.querySelectorAll('.section-contents');
    const rowCount = subContents.length;

    // Tạo grid-template-rows động, thêm 1 hàng cho tiêu đề
    const rowTemplate = Array(rowCount + 1).fill('1fr').join(' ');

    previewHTML = `
      <div style="margin-top: 60px; display: grid; grid-template-columns: 1fr; grid-template-rows: ${rowTemplate}; gap: 1px; border: 1px solid black; background-color: black;">
        <div style="grid-column: 1 / -1; grid-row: 1 / 2; background-color: #ffcc33; padding: 10px;">
          <h3 style="margin: 0; font-size: 16px; color: white; font-weight: bold;">Thông tin của ${normalizedText}</h3>
        </div>
    `;
    subContents.forEach((subContent, idx) => {
      const subName = subContent.getAttribute('data-name');
      previewHTML += `
        <div style="grid-column: 1 / 2; grid-row: ${idx + 2} / ${idx + 3}; background-color: #f9f9f9; padding: 10px;">
          <p style="margin: 0;">${subName}${isContentEmpty ? ': Đang rỗng' : ''}</p>
        </div>
      `;
    });
    previewHTML += `
      </div>
    `;
  } else {
    previewHTML = `
      <div style="margin-top: 60px; display: grid; grid-template-columns: ${hasImage ? '9fr 5fr' : '1fr'}; grid-template-rows: 1fr ${hasImage ? '1fr' : ''}; gap: 1px; border: 1px solid black; background-color: black;">
        <div style="grid-column: 1 / -1; background-color: #ffcc33; padding: 10px;">
          <h3 style="margin: 0; font-size: 16px; color: white; font-weight: bold;">Thông tin của ${normalizedText}</h3>
        </div>
        <div style="background-color: #f9f9f9; padding: 10px; ${hasImage ? '' : 'grid-column: 1 / -1;'}">
          <p style="margin: 0;">Nội dung của ${normalizedText}${isContentEmpty ? ': Đang rỗng' : ''}</p>
        </div>
    `;
    if (hasImage) {
      previewHTML += `
        <div style="background-color: #f9f9f9; padding: 10px;">
          <p style="margin: 0;">Ảnh của ${normalizedText}</p>
        </div>
      `;
    }
    previewHTML += `
      </div>
    `;
  }

  // Gộp cả hai bảng vào tableContainer
  tableContainer.innerHTML = tableHTML + previewHTML;

  // Cập nhật sidebar và active mục tương ứng
  let sidebarContent = `
    <h4 class="w3-bar-item"><b>${navName}</b></h4>
  `;
  headersData.forEach(header => {
    const isActive = header.id === selectedHeader.id ? ' active' : '';
    sidebarContent += `
      <a class="w3-bar-item w3-button w3-hover-black${isActive}" href="#${header.id}">${normalizeString(header.text)}</a>
    `;
  });
  mySidebar.innerHTML = sidebarContent;

  // Cập nhật trạng thái và hiển thị nút quay lại
  adminState = 'layout';
  isHelpSection = false; // Đặt lại trạng thái trang hướng dẫn
  currentIndex = index;
  currentNavName = navName;
  currentHeaderIndex = headerIndex;
  currentContentRow = null;
  updateBackButton();
}

// Cập nhật lại html và hiện thị lại giao diện
function showContent(sectionId) {
  const sections = document.querySelectorAll('.w3-container');
  sections.forEach(section => section.classList.add('hidden'));
  const buttons = document.querySelectorAll('.w3-bar-item');
  buttons.forEach(button => button.classList.remove('active'));

  // Kiểm tra xem section có tồn tại trước khi hiển thị   
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  } else {
    console.warn(`Section với id "${sectionId}" không tồn tại trong HTML.`);
    alert(`Section "${sectionId}" không tồn tại. Vui lòng kiểm tra lại HTML hoặc tạo section này.`);
    return;
  }

  const sidebar = document.getElementById("mySidebar");
  sidebar.innerHTML = '';

  function generateSidebar(sectionId, sidebarTitle) {
    const section = document.getElementById(sectionId);
    const sectionHeaders = section ? section.querySelectorAll('.section-header') : [];
    const headersData = Array.from(sectionHeaders).map(header => ({
      id: header.id,
      text: header.textContent.trim()
    }));
    let sidebarContent = `
      <h4 class="w3-bar-item"><b>${sidebarTitle}</b></h4>
    `;
    headersData.forEach(header => {
      sidebarContent += `
        <a class="w3-bar-item w3-button w3-hover-black" href="#${header.id}">${normalizeString(header.text)}</a>
      `;
    });
    return sidebarContent;
  }

  // Trường hợp đặc biệt: courseInfo
  if (sectionId === 'courseInfo') {
    sidebar.innerHTML = generateSidebar('courseInfo', 'Menu');
    adminState = 'top'; // Đặt lại trạng thái
    updateBackButton();
  }
  // Trường hợp đặc biệt: admin-page
  else if (sectionId === 'admin-page') {
    // Cập nhật sidebar để hiển thị danh sách các mục điều hướng
    let sidebarContent = `
      <h4 class="w3-bar-item"><b>Admin page</b></h4>
    `;
    // Thêm các mục điều hướng vào sidebar
    sidebarContent += `
      <a class="w3-bar-item w3-button w3-hover-black" href="#courseInfo">Trang chủ</a>
    `;
    navNames.forEach((name, index) => {
      if (index < navNames.length - 1) {
        const sectionId = sectionIds[index];
        sidebarContent += `
          <a class="w3-bar-item w3-button w3-hover-black" href="#${sectionId}">${name}</a>
        `;
      }
    });
    sidebar.innerHTML = sidebarContent;

    const tableContainer = document.getElementById('admin-menu-table');
    const navtopInfo = document.getElementById('navtop-info');
    if (navtopInfo) {
      navtopInfo.style.display = 'block'; // Đảm bảo navtop-info hiển thị
    }
    const navtopHeader = document.querySelector('#navtop-info .section-header');
    navtopHeader.textContent = 'Các mục điều hướng'; // Đặt tiêu đề đúng

    // Cập nhật tiêu đề của admin-page
    const header = document.querySelector('#admin-page .header');
    if (adminState === 'top') {
      header.textContent = 'Admin menu top';
    }

    // Nếu không ở trạng thái 'top', không cần tạo lại bảng (giữ nguyên trạng thái hiện tại)
    if (adminState === 'top') {
      let tableHTML = `
        <table class="table-info">
          <thead>
            <tr>
              <th>Tên mục điều hướng</th>
              <th>Các thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Trang chủ</td>
              <td>
                <i class="fas fa-eye" style="margin-right: 60px; cursor: pointer;" title="View" onclick="viewNavDetails(-1, 'Trang chủ')"></i>
                <i class="fas fa-plus" style="margin-right: 10px; cursor: pointer;" title="Thêm hàng mới" onclick="addNavName(-1)"></i>
              </td>
            </tr>
      `;
      navNames.forEach((name, index) => {
        if (index < navNames.length - 1) {
          tableHTML += `
            <tr>
              <td>${name}</td>
              <td>
                <i class="fas fa-eye" style="margin-right: 10px; cursor: pointer;" title="View" onclick="viewNavDetails(${index}, '${name}')"></i>
                <i class="fas fa-pencil-alt" style="margin-right: 10px; cursor: pointer;" title="Edit" onclick="editNavName(${index})"></i>
                <i class="fas fa-times" style="margin-right: 10px; cursor: pointer;" title="Delete" onclick="deleteNavName(${index})"></i>
                <i class="fas fa-plus" style="margin-right: 10px; cursor: pointer;" title="Thêm hàng mới" onclick="addNavName(${index})"></i>
              </td>
            </tr>
          `;
        }
      });
      tableHTML += `
          </tbody>
        </table>
      `;
      tableContainer.innerHTML = tableHTML;
    }

    updateBackButton();
  }
  // Xử lý động cho các sectionId trong sectionIds
  else if (sectionIds.includes(sectionId)) {
    const index = sectionIds.indexOf(sectionId);
    const sidebarTitle = navNames[index];
    sidebar.innerHTML = generateSidebar(sectionId, sidebarTitle);

    // Đặc biệt cho section "student-info" (Thông tin sinh viên)
    if (sectionId === 'student-info') {
      const section = document.getElementById(sectionId);
      const sectionHeaders = section.querySelectorAll('.section-header');
      sectionHeaders.forEach(header => {
        const headerText = header.textContent.trim();
        const contentDiv = header.nextElementSibling;
        if (contentDiv && contentDiv.classList.contains('content')) {
          const subContents = contentDiv.querySelectorAll('.section-contents');
          const rowCount = subContents.length;

          if (subContents.length > 0) {
            // Tạo grid-template-rows động
            const rowTemplate = Array(rowCount).fill('1fr').join(' ');

            let gridHTML = '';
            if (headerText === 'CV') {
              const nonImageContents = Array.from(subContents).filter(sc => sc.getAttribute('data-name') !== 'Ảnh của sinh viên');
              const imageContent = Array.from(subContents).find(sc => sc.getAttribute('data-name') === 'Ảnh của sinh viên');
              const rowCountNonImage = nonImageContents.length;

              // Tạo grid layout cho CV (2 cột, không có border)
              const rowTemplateCV = Array(rowCountNonImage).fill('1fr').join(' ');
              gridHTML = `
                <div style="display: grid; grid-template-columns: 9fr 5fr; grid-template-rows: ${rowTemplateCV}; gap: 0px; background-color: white;">
              `;
              nonImageContents.forEach((subContent, idx) => {
                gridHTML += `
                  <div style="grid-column: 1 / 2; grid-row: ${idx + 1} / ${idx + 2};display: flex;justify-content: center; align-items: center; background-color: #f9f9f9; padding: 10px;">
                    ${subContent.innerHTML}
                  </div>
                `;
              });
              if (imageContent) {
                gridHTML += `
                  <div style="grid-column: 2 / 3; grid-row: 1 / ${rowCountNonImage + 1}; background-color: #f9f9f9; padding: 10px;">
                    ${imageContent.innerHTML}
                  </div>
                `;
              }
              gridHTML += `
                </div>
              `;
            } else if (['Các dự án đã tham gia', 'Sinh hoạt cộng đồng'].includes(headerText)) {
              // Tạo grid layout cho "Các dự án đã tham gia" và "Sinh hoạt cộng đồng" (1 cột, không có border)
              gridHTML = `
                <div style="display: grid; grid-template-columns: 1fr; grid-template-rows: ${rowTemplate}; gap: 0px; background-color: white;">
              `;
              subContents.forEach((subContent, idx) => {
                gridHTML += `
                  <div style="grid-column: 1 / 2; grid-row: ${idx + 1} / ${idx + 2}; background-color: #f9f9f9; padding: 10px;">
                    ${subContent.innerHTML}
                  </div>
                `;
              });
              gridHTML += `
                </div>
              `;
            }
            contentDiv.innerHTML = gridHTML;
          }
        }
      });
    }

    adminState = 'top'; // Đặt lại trạng thái
    updateBackButton();
  }

  if (event && event.target) {
    event.target.classList.add('active');
  }
}

window.onload = function () {
  showContent('courseInfo');
  updateMenuTop();
};