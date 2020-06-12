/** 크게 headerform, viewform 컴포넌트로 구성
 *
 * app -> headerform
 *     -> viewform  -> selectedTab   (True) ->  coffee tab    //커피 탭 선택
 *                                   (False)->  beverage tab  //음료 탭 선택
 *                 ->  selectedMenu  (True) ->  menuview      // menu 페이지
 *                                   (False)->  detailview    // 상세페이지
 */

import BeverageMenu from "./models/BeverageMenu.js";
import CoffeeMenu   from "./models/CoffeeMenu.js";
import SearchMenu   from "./models/SearchMenu.js";

//'headerform'이라는 전역컨포넌트를 선언한다.
//'메뉴검색'이라는 타이틀을 적용시킨다.
const headerform = {
  template: `
    <header>
      <h3>메뉴 검색</h3>
    </header>
    `
};

//'viewform'이라는 전역컨포넌트를 선언한다.
const viewform = {
  //상위 컴포넌트로 부터 데이터를 수신한다.
  props: ["propsdata"],
  data() {
    return {
      selectedTab: true, //  탭 선택   | true-> coffee   | false-> beverage |
      selectedMenu: true, // 검색여부   | true-> 메뉴선택창 | false -> 검색 된 창 |
      message: "" // 입력 폼에 나타나질 데이터
    };
  },
  //viewform 화면 구성
  template: `
  <div>
    <!--입력 창 -->
    <!-- Enter키 입력시 자동으로 submit 방지-->
    <form onsubmit="return false">
      <input 
      type="text" 
      placeholder="드실 음료를 검색하세요" 
      @keyup.enter='inputenter'
      v-model="message"
      >
      <i class="btn-reset" v-if="message" @click="reset"></i>
    </form>


    <!-- selectedMenu==true -->
    <!-- Menu 탭 창 selectedMenu가 true 시 메뉴 선택 창 기본적으로 커피메뉴가 보여진다. -->
    <div id="menuview" v-if="selectedMenu">
          <!-- Menu 탭 창 selectedTab가 true 시 커피탭이 active 상태가 된다. -->
          <ul class="tabs">
            <li v-on:click="tabonclick(true)" v-bind:class="{active: this.selectedTab}">커피메뉴</li>
            <li v-on:click="tabonclick(fasle)" v-bind:class="{active: !this.selectedTab}">음료메뉴</li>
          </ul>
          
          <!-- selectedTab==true -->
          <!-- selectedTab가 true 시 커피메뉴들이 보여진다. -->
          <!-- 커피 리스트 창 -->
          <ul v-if="this.selectedTab" class="list">
            <li v-for="(item, index) of propsdata.CoffeeMenus[0]" v-on:click="coffeelistclick(item.name)">
              <span class="number">{{index+1}}</span>
              {{item.name}}
            </li>
            <!-- 커피 리스트가 비어있을때 보여진다. -->
            <div v-if="propsdata.CoffeeMenus ==0">커피 메뉴가 등록되지 않았습니다.</div>
          </ul>

          <!-- selectedTab==false -->
          <!-- selectedTab가 false 시 음료메뉴들이 보여진다. -->
          <!-- 음료 리스트 창 -->
          <ul v-else class="list">
            <li v-for="(item, index) of propsdata.BeverageMenus[0]">
              <span v-on:click="listclick(item.name)">{{item.name}}</span>
              <span class="price" v-on:click="listclick(item.name)">{{item.price}}</span>
              <button class="btn-remove" v-on:click="propsdata.BeverageMenus[0].splice(index, 1)"></button>
            </li>
            <!-- 음료 리스트가 비어있을때 보여진다. -->
            <div v-if="propsdata.BeverageMenus ==0">등록된 음료 메뉴가 없습니다.</div>
          </ul>
        </div>
    <!-- selectedMenu==false -->
    <!-- Menu 탭 창 selectedMenu가 false 시 상세페이지가 보여진다. -->
    <!-- 음료/커피 상세 창 -->
    <ul id="resultview" v-else class="list">
      <li search-result v-for="item of propsdata.SearchMenus[0]">
        <img :src="item.image">
        {{item.name}}
      </li>
    </ul>
  </div>
    `,

  /**
   *    -- 메소드 이름 --             -- 설 명 --
   *  listclick(item)       | 리스트의 item 클릭시 상세페이지로 이동
   *  coffeelistclick(item) | 리스트의 item 클릭시 상세페이지로 이동, 커피데이터 이름과숫자 분리
   *  tabonclick(state)     | 커피/음료 탭 클릭시 active 변경
   *  reset                 | input창의 X버튼 입력시 리셋 , 다시 메뉴페이지로 이동
   *  inputenter            | input창에 Enter 입력 시 상세페이지 이동
   */
  methods: {
    listclick(item) { 
      this.message = item              // message를 item으로 변경 -> input창에 표시
      this.selectedMenu = false;       // selectedMenu를 false시켜줌으로써 상세페이지로 이동
    },
    coffeelistclick(item) {
      var splitmessage = item.split(" ");     // 띄어쓰기 기준으로 이름과 금액 분리
      this.message = splitmessage[0];         // 이름만 message에 담기
      this.selectedMenu = false;              // selectedMenu를 false시켜줌으로써 상세페이지로 이동
    },
    tabonclick: function(state) {
      this.selectedTab = state;        //전달된 state를 selected로 변경
    },
    reset() {
      this.message = "";               //message를 빈칸으로 리셋
      this.selectedMenu = true;       //selectedMenu을 true로 변경해줌으로써 메뉴페이지로 이동
    },
    inputenter() {
      this.selectedMenu = false;     //selectedMenu을 false로 변경해줌으로써 상세페이지로 이동
    }
  }
};


/**
 *  new Vue 생성
 *  id = "MyApp"
 */
const app = new Vue({
  el: "#MyApp",

  /* props 로 하위 컴포넌트에서 받을 데이터 */
  /* Menus로 한번에 묶어 전송  */
  data: {
    Menus: {
      BeverageMenus: [], // 음료 데이터를 담을 리스트
      CoffeeMenus: [],   // 커피 데이터를 담을 리스트
      SearchMenus: []    // 상세 데이터를 담을 리스트
    }
  },

  // 전역컴포넌트로 선언
  components: {
    headerform: headerform,
    viewform: viewform,
  },

  /** 
   * 인스턴스가 작성된 후 동기적으로 호출
   *  콜백함수로 데이터 선언
   *  각 리스트들에 PUSH
   */
  created() {
    CoffeeMenu.list().then(result => {
      this.Menus.CoffeeMenus.push(result);
    });
    BeverageMenu.list().then(result => {
      this.Menus.BeverageMenus.push(result);
    });
    SearchMenu.list().then(result => {
      this.Menus.SearchMenus.push(result);
    });
  }
});

export default app;
