export default (roleNumber) => {
    switch (roleNumber) {
        case 0:
            return "User";
        case 1:
            return "Donator";
        case 2:
            return "Admin";
        default:
            return "";
    }
}