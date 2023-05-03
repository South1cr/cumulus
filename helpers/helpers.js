const round = (num) => {
    return Math.round(num);
}

const formatDate = (date) => {
    return date.toDateString();
}

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getTempUnit = (units) => {
    if (units === 'imperial') {
        return 'F';
    } else {
        return 'C';
    }
}

const select = (selected, options) => {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
}

module.exports = {
    round,
    formatDate,
    capitalize,
    getTempUnit,
    select
};