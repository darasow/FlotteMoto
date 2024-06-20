function toggleDD(myDropMenu) {
    document.getElementById(myDropMenu).classList.toggle("invisible");
  }
  
  function filterDD(myDropMenu, myDropMenuSearch) {
    var input, filter, div, a, i;
    input = document.getElementById(myDropMenuSearch);
    filter = input.value.toUpperCase();
    div = document.getElementById(myDropMenu);
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }
  
  window.onclick = function(event) {
    if (!event.target.matches('.drop-button') && !event.target.matches('.drop-search')) {
      var dropdowns = document.getElementsByClassName("dropdownlist");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (!openDropdown.classList.contains('invisible')) {
          openDropdown.classList.add('invisible');
        }
      }
    }
  }
  

  
  document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.getElementById('profileDropdown');
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    
    // Debugging information
    console.log(profileButton, profileDropdown);

    // Ensure all elements are found before adding event listeners
    if (profileButton && profileDropdown) {
        // Toggle profile dropdown visibility
        profileButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click event from propagating to document
            profileDropdown.classList.toggle('hidden');
            profileDropdown.classList.toggle('opacity-0');
        });
    }

    // Close profile dropdown if clicking outside
    document.addEventListener('click', (event) => {
        if (!profileButton.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.add('hidden');
            profileDropdown.classList.add('opacity-0');
        }
    });

    // Toggle sidebar visibility
    if (menuButton && sidebar) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }
});
