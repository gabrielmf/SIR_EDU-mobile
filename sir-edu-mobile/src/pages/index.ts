import { HomePage } from './home/home';
import { ListPage } from './list/list';
import LoginPage from './login';
import { StudentPage, FileActions } from './student';
import SendFileModalPage from './student/send-file-modal';
import StudentDetailsPage from './student-details';
import SettingsPage from './Settings';

const pages = [
    HomePage,
    ListPage,
    LoginPage,
    StudentPage,
    FileActions,
    SendFileModalPage,
    StudentDetailsPage,
    SettingsPage
];

export default pages;