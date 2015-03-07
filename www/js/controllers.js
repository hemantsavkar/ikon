angular.module('starter.controllers', [])

.controller('ridebookingCtrl', function($scope,$rootScope,$cordovaActionSheet,$filter,$cordovaDatePicker) {

var servinglocations=[{id:1,name:'Pune'},{id:2,name:'Mumbai'},{id:3,name:'Nasik'},{id:4,name:'Other'}]    

 $rootScope.journeyTypes = [
        { text: "One Way", value: "oneway"},
        { text: "Return", value: "return" }
       
    ];
init();

function init()
    {
    $rootScope.source={
            name:"Choose Departure"
        };
    $rootScope.destination={
        name:"Choose Destination"
    };
    $rootScope.departuredate="Departure On";
    $rootScope.returndate="Returning On";
    $rootScope.trip={
        journeyType:"oneway"
    };
}
    
  $scope.reset=function(){
      init();
  }
    
  

$scope.serverSideChange = function(item) {
    $rootScope.trip={
        journeyType:item.value
    }
  };

$scope.isBookable=function(){

    if($rootScope.trip.journeyType=="oneway"){
    return  ($rootScope.trip.journeyType!=null && $rootScope.source.name!="Choose Departure" &&$rootScope.destination.name!="Choose Destination" && $rootScope.departuredate!="Departure On");
    } else if($rootScope.trip.journeyType=="return"){
        return  ($rootScope.trip.journeyType!=null && $rootScope.source.name!="Choose Departure" &&$rootScope.destination.name!="Choose Destination" && $rootScope.departuredate!="Departure On" && $rootScope.returndate!="Returning On" );
    }
    


}
    
    
function getLocationById(id){
    var valueToReturn=null;
    angular.forEach(servinglocations, function(location) {
              if(location.id==id)
              {
                  valueToReturn= location.name;
              }
            });
    return valueToReturn;
}
    
var optionsSource = {
    title: 'Choose Departure',
    addCancelButtonWithLabel: 'Cancel',
    androidEnableCancelButton : false,
    winphoneEnableCancelButton : true,
    addDestructiveButtonWithLabel : ''
  };
    
    $scope.getSource=function(){
        optionsSource.buttonLabels=[];
        angular.forEach(servinglocations, function(location) {
              optionsSource.buttonLabels.push(location.name);
            });
        $cordovaActionSheet.show(optionsSource)
          .then(function(btnIndex) {
            var sour=getLocationById(btnIndex);
            if(sour)
                $rootScope.source=sour;
          });
    }
    
    var optionsDestination = {
    title: 'Choose Destination',
    addCancelButtonWithLabel: 'Cancel',
    androidEnableCancelButton : false,
    winphoneEnableCancelButton : true,
    addDestructiveButtonWithLabel : ''
  };
    
    $scope.getDestination=function(){
        optionsDestination.buttonLabels=[];
        angular.forEach(servinglocations, function(location) {
              optionsDestination.buttonLabels.push(location.name);
            });
        $cordovaActionSheet.show(optionsDestination)
          .then(function(btnIndex) {
            var dest=getLocationById(btnIndex);
            if(dest)
            $rootScope.destination=dest;
          });
    }
    
    
    $rootScope.departuredate="Departure On";
    $rootScope.returndate="Returning On";
    
    var options = {
	date: new Date(),
	mode: 'date',
	minDate:  Date() - 10000,
	allowOldDates: false,
	allowFutureDates: true,
	doneButtonLabel: 'Done',
	doneButtonColor: '#000000',
	cancelButtonLabel: 'Cancel',
	cancelButtonColor: '#000000'
};
    
        $scope.selectDaprtDate=function(){
            if(!angular.isDate(options.date)){
              var dateSpli=options.date.split("/");
                options.date=new Date (dateSpli[0]+"/"+dateSpli[1]+"/"+dateSpli[2]);
            }
            
        $cordovaDatePicker.show(options).then(function(date){
            if(date){
            options.date=date;
            $rootScope.departuredate=$filter('date')(date, "dd MMM yyyy");
            }
            else
            {
            options.date=new Date();
            }
        });
    
    }
        $scope.selectRaturmDate=function(){
            if(!angular.isDate(options.date)){
              var dateSpli=options.date.split("/");
                options.date=dateSpli[0]+"/"+dateSpli[1]+"/"+dateSpli[2];
            }
        $cordovaDatePicker.show(options).then(function(date){
            if(date){
            options.date=date;
            $rootScope.returndate=$filter('date')(date, "dd MMM yyyy");
            }else
            {
            options.date=new Date();
            }
        });
    
    }
})

.controller('ServingLocationsCtrl', function($scope,$rootScope, $stateParams,$ionicHistory) {
    
      $scope.servinglocations=[
          {id:1,name:'Pune'},
          {id:2,name:'Mumbai'},
          {id:3,name:'Nasik'},
          {id:4,name:'Nagpur'},
          {id:5,name:'Kolhapur'},
          {id:6,name:'Satara'},
          {id:7,name:'Pune Airport'},
          {id:8,name:'Mumbai Airport'}
      ];
    
    
  var forLocation=$stateParams.locationType;
    if(forLocation==1)
    {
        $scope.title="Departing From"
        if($rootScope.source){
            $scope.data={
            selectedLocation:$rootScope.source.id
            };
        }
    }
    else if(forLocation==2)
    {
        $scope.title="Going To"
        if($rootScope.destination){
             $scope.data={
            selectedLocation:$rootScope.destination.id
            };
        }
    }
    
     

    $scope.locationselected = function(item) {
        var forLocation=$stateParams.locationType;
            if(forLocation==1)
            {
                    $rootScope.source=item;
            }
            else if(forLocation==2)
            {
                    $rootScope.destination=item;
            }
        $ionicHistory.goBack();
  };
    
})

.controller('BookinghistoryCtrl', function($scope, $cordovaSpinnerDialog) {
    $scope.historyOptions=[
          {id:1,name:'Current'},
          {id:2,name:'Presvious'}
      ];
    
    $scope.history={
        historyType:1
    }
    
  loadBookings();
    $scope.historyTypeChange=function(item)
    {
         $scope.history={
            historyType:item.id
        }
        loadBookings();
    }
    
    function loadBookings(){
    
        var newdate = new Date();

        newdate.setDate(newdate.getDate());

        var nd = new Date(newdate);
        
    //$cordovaSpinnerDialog.show(null,null, true);
        $scope.bookings = [];
            if($scope.history.historyType==1){
                for (var i=0; i<2; i++) {
                    newdate.setDate(newdate.getDate() + i); // minus the date
                        $scope.bookings[i] = {
                            date:new Date(newdate),
                            time:'12:15 PM',
                            from:'Pune',
                            to:'Mumbai'
                        };
                      }
                }
            else
            {
                newdate.setDate(newdate.getDate()-2);

                    var nd = new Date(newdate);
                     for (var i=0; i<10; i++) {
                         
                         newdate.setDate(newdate.getDate() - i)
                           $scope.bookings[i] = {
                            date:new Date(newdate),
                            time:'12:15 PM',
                            from:'Pune',
                            to:'Mumbai'
                        };
                      }
            }
       // $cordovaSpinnerDialog.hide();
    
    }
    
  
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  }
    
    
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
