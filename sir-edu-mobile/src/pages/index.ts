import { HomePage } from './home/home';
import { ListPage } from './list/list';
import LoginPage from './login';
import { StudentPage, FileActions } from './student';
import SendFileModalPage from './student/send-file-modal';
import StudentDetailsPage from './student-details';

const pages = [
    HomePage,
    ListPage,
    LoginPage,
    StudentPage,
    FileActions,
    SendFileModalPage,
    StudentDetailsPage
];

export default pages;