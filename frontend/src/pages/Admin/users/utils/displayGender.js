export default (genderNumber) => {
    switch (genderNumber) {
        case 0:
            return "Male";
        case 1:
            return "Female";
        case 2:
            return "Other";
        default:
            return "";
    }
}