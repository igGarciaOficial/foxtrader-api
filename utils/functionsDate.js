
const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

module.exports = {

    isBissextoYear(year){
        if(!(year%400)){
            return true;
        }else if((year%100) && (year%4)){
            return false;
        }else if(!(year%4)){
            return true;
        }else{
            return false;
        }
    },

    getTotalOfDaysCurrentMonth(){

        let today = new Date()
        let yearToday = today.getFullYear();
        let monthToday = today.getMonth();
        
        if(monthToday == 1){
            let fevDays = daysPerMonth[monthToday];
            return (this.isBissextoYear(yearToday))?fevDays+1:fevDays;
        }else{
            return daysPerMonth[monthToday];
        }

    }


}
