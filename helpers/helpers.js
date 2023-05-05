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

const getSpeedUnit = (units) => {
    if (units === 'imperial') {
        return 'mph';
    } else {
        return 'm/s';
    }
}

const getWindDirection = (degree) => {
    const index=parseInt((degree/22.5)+.5);
    const directions=["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return directions[(index % 16)];
}

const setSelected = (selected, options) => {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
}

module.exports = {
    round,
    formatDate,
    capitalize,
    getTempUnit,
    getSpeedUnit,
    getWindDirection,
    setSelected
};