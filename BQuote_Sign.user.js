// ==UserScript==
// @name        BQuote Sign ⭐
// @namespace        http://tampermonkey.net/
// @version        1.0
// @description        引用部「blockquote」をデザインする「Ctrl+F2」
// @author        Ameba Blog User
// @match        https://blog.ameba.jp/ucs/entry/srventry*
// @exclude        https://blog.ameba.jp/ucs/entry/srventrylist.do*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameblo.jp
// @grant        none
// @updateURL        https://github.com/personwritep/BQuote_Sign/raw/main/BQuote_Sign.user.js
// @downloadURL        https://github.com/personwritep/BQuote_Sign/raw/main/BQuote_Sign.user.js
// ==/UserScript==


let mode=0; // ツールのON/OFF
let bq_set; // デザイン種

let retry=0;
let interval=setInterval(wait_target, 100);
function wait_target(){
    retry++;
    if(retry>10){
        clearInterval(interval); }
    let target=document.querySelector('#cke_1_contents');
    if(target){
        clearInterval(interval);
        main(); }}



function main(){
    let editor_iframe;
    let iframe_doc;
    let iframe_body;

    let ua=0;
    let agent=window.navigator.userAgent.toLowerCase();
    if(agent.indexOf('firefox')>-1){ ua=1; }



    let read_json=localStorage.getItem('BQ_Style');
    let bqcard_set=JSON.parse(read_json);
    if(!Array.isArray(bqcard_set)){
        bqcard_set=[0, "#fff", "#fff", "", ""]; }

    let write_json=JSON.stringify(bqcard_set);
    localStorage.setItem('BQ_Style', write_json);



    let target0=document.querySelector('#cke_1_contents');
    let monitor0=new MutationObserver( catch_key );
    monitor0.observe(target0, {childList: true});

    catch_key();

    function catch_key(){
        editor_iframe=document.querySelector('.cke_wysiwyg_frame');
        if(editor_iframe){
            iframe_doc=editor_iframe.contentWindow.document;
            if(iframe_doc){

                when_back();

                iframe_doc.addEventListener('keydown', check_key);
                document.addEventListener('keydown', check_key);

                function check_key(event){
                    if(event.ctrlKey && event.keyCode==113){ // ショートカット「Ctrl+F2」
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        if(mode==0 && editor_iframe){
                            mode=1;
                            sign();
                            sign_reset();
                            card_edit(); }
                        else if(mode==1 && editor_iframe){
                            mode=0;
                            sign_clear();
                            card_close(); }}

                    if(event.keyCode==116){
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        alert(
                            "　⛔　F5 / Ctrl + F5 / Shift + F5　\n"+
                            "　　　　このショートカットは現在のページを遷移して、編集中の\n"+
                            "　　　　データを損失する可能性があるので、無効にしています。\n"+
                            "　　　　　　-----　BQuote Sign　-----"); }}}}

        before_end();

    } // catch_key()



    function when_back(){
        if(mode==1){
            sign();
            sign_reset();
            card_close();
            card_edit(); }}



    function card_close(){
        iframe_body=iframe_doc.querySelector('body');
        if(iframe_body){
            let target_card=iframe_body.querySelectorAll('blockquote');
            for(let k=0; k<target_card.length; k++){
                if(target_card[k].classList.contains('edit_card')){
                    target_card[k].classList.remove('edit_card'); }}}}



    function card_edit(){
        iframe_body=iframe_doc.querySelector('body');
        if(iframe_body){
            let target_card=iframe_body.querySelectorAll('blockquote');
            for(let k=0; k<target_card.length; k++){
                target_card[k].addEventListener('click', function(event){
                    set_card(target_card[k], event); }); } // Card編集開始

            function set_card(card, event){
                event.preventDefault();
                event.stopImmediatePropagation();
                if(mode==1 &&
                   !card.classList.contains('edit_card') && event.ctrlKey){ // 対象カードに指定
                    if(!card.classList.contains('twitter-tweet')){
                        card_close(); // 他のCardを閉じる
                        sign_reset();
                        card.classList.add('edit_card');
                        edit_in(card); }}}

        }} // card_edit()



    function edit_in(card){
        if(mode==1){
            set_mark(card);
            bgm_color(card);
            bg_color(card);
            mem_plus(card);
            mem_paste(card);
        }} // edit_in()



    function sign_reset(){
        let bqm_color=document.querySelector('#bqm_color');
        let bqm_trance=document.querySelector('#bqm_trance');
        if(bqm_color && bqm_trance){
            bqm_color.style.backgroundColor='rgb(255, 255, 255)';
            bqm_trance.value=1; }
        let bq_color=document.querySelector('#bq_color');
        let bq_trance=document.querySelector('#bq_trance');
        if(bq_color && bq_trance){
            bq_color.style.backgroundColor='rgb(255, 255, 255)';
            bq_trance.value=1; }}



    function set_mark(card){
        let bqm=card.querySelector('.bqm');
        if(!bqm){
            add_style(card, 0);
            add_svg(card, 0); }
        else{
            for(let k=0; k<10; k++){
                if(bqm.classList.contains('m'+k)){
                    bq_set=k;
                    break;}}}

        let bqz=document.querySelector('#bqz'); // デザイン選択
        if(bqz){
            bqz.onclick=function(){
                if(card.classList.contains('edit_card')){
                    if(bq_set<7){
                        bq_set=bq_set+1; }
                    else{
                        bq_set=0; }

                    add_style(card, bq_set);
                    add_svg(card, bq_set);
                }}}}


    function add_style(card, n){
        switch(n){
            case 0:
            case 1:
            case 2:
            case 3:
                card.style.border='1px solid #ddd';
                card.style.position='relative';
                card.style.padding='0.32em 0 0.2em 3em';
                card.style.margin='0.5em 0';
                break;
            case 4:
                card.style.borderLeft='5px solid';
                card.style.position='relative';
                card.style.padding='0.32em 0 0.2em 1.5em';
                card.style.margin='0.5em 0 0.5em 1em';
                break;
            case 5:
                card.style.borderLeft='25px solid';
                card.style.position='relative';
                card.style.padding='0.32em 0 0.2em 0.5em';
                card.style.margin='0.5em 0';
                break;
            case 6:
                card.style.borderLeft='25px solid';
                card.style.position='relative';
                card.style.padding='0.32em 0 0.2em 0.5em';
                card.style.margin='0.5em 0';
                break;
            case 7:
                card.style.border='1px solid #ddd';
                card.style.position='relative';
                card.style.padding='0.32em 0 0.2em 2em';
                card.style.margin='0.5em 0';
                break;
        }}


    function add_svg(card, n){
        let SVG_bqm;
        switch(n){
            case 0:
                SVG_bqm=
                    '<i class="bqm m0" '+
                    'style="font-size: 48px; color: #fff; background: transparent; '+
                    'position: absolute; top: -8px; left: 10px; '+
                    'filter: drop-shadow(black 0 0 0.6px); font-style: normal;">❝</i>';
                break;
            case 1:
                SVG_bqm=
                    '<i class="bqm m1" '+
                    'style="font-size: 48px; color: #fff; background: transparent; '+
                    'position: absolute; top: -8px; left: 10px; font-style: normal;">❝</i>';
                break;
            case 2:
                SVG_bqm=
                    '<i class="bqm m2" '+
                    'style="font-size: 48px; color: #fff; background: transparent; '+
                    'position: absolute; top: -8px; left: 10px; '+
                    'text-shadow: 1px 1px 1px black, 0 0 1px black; font-style: italic;">"</i>';
                break;
            case 3:
                SVG_bqm=
                    '<i class="bqm m3" '+
                    'style="font-size: 48px; color: #fff; background: transparent; '+
                    'position: absolute; top: -8px; left: 10px; '+
                    'text-shadow: white 1px 0.6px; font-style: italic;">"</i>';
                break;
            case 4:
                SVG_bqm=
                    '<i class="bqm m4" '+
                    'style="font-size: 0; color: #fff; background: transparent; '+
                    'position: absolute; top: -8px; left: 10px;"> </i>';
                break;
            case 5:
                SVG_bqm=
                    '<i class="bqm m5" '+
                    'style="font-size: 40px; color: #fff; background: transparent; '+
                    'filter: brightness(50) drop-shadow(1px 1px 1px black); '+
                    'position: absolute; top: -4px; left: -23px; font-style: normal;">❝</i>';
                break;
            case 6:
                SVG_bqm=
                    '<i class="bqm m6" '+
                    'style="font-size: 40px; color: #fff; background: transparent; '+
                    'filter: brightness(0); '+
                    'position: absolute; top: -4px; left: -23px; font-style: normal;">❝</i>';
                break;
            case 7:
                SVG_bqm=
                    '<i class="bqm m7" '+
                    'style="font-size: 40px; color: #fff; background: transparent; '+
                    'position: absolute; top: -4px; left: 4px; font-style: normal;">❝</i>';
                break;
        } // switch()



        let svg_quote=card.querySelector('svg'); // svg使用タイプの継承
        if(svg_quote){
            let quote_color=svg_quote.style.fill;
            let bqm_color=document.querySelector('#bqm_color');
            if(quote_color && bqm_color){
                bqm_color.style.backgroundColor=quote_color; }
            svg_quote.remove(); } // svg画像を削除



        let SVG=iframe_doc.createElement('i');
        if(!card.querySelector('i')){
            card.appendChild(SVG); }
        card.querySelector('i').outerHTML=SVG_bqm;

        let bqm=card.querySelector('.bqm'); // SVGマーク
        let bqm_color=document.querySelector('#bqm_color');

        if(bqm && bqm_color.style.backgroundColor){
            bqm.style.color=bqm_color.style.backgroundColor;
            if(n==4 || n==5 || n==6){
                card.style.borderLeftColor=bqm_color.style.backgroundColor; }}

    } // add_svg()



    function bgm_color(card){
        let set_color;
        let bqm_c; // 引用部の svg色・縦傍線色
        let bqm_color=document.querySelector('#bqm_color');
        let bqm_trance=document.querySelector('#bqm_trance');

        let bqm=card.querySelector('.bqm'); // SVGマーク
        if(!bqm){
            bq_set=0;
            bqm_c='rgb(255, 255, 255)'; }
        else{
            for(let k=0; k<10; k++){
                if(bqm.classList.contains('m'+k)){
                    bq_set=k;
                    break; }}
            if(bqm.style.color){
                bqm_c=bqm.style.color; } // 縦傍線色は svg色をコピーする
            else{
                bqm_c='rgb(255, 255, 255)'; }}


        bqm_color.style.backgroundColor=bqm_c;
        bqm_trance.value=rgba_trance(bqm_c);
        set_color=bqm_c;

        import_color(card, bqm_color, "bqm_c");

        let sw=bqm_color;
        let monitor_elem=new MutationObserver(import_c);
        monitor_elem.observe(sw, {attributes: true});
        function import_c(){
            if(sw.style.opacity==2){
                monitor_elem.disconnect();
                setTimeout(()=>{
                    bqm_trance.value=1;
                    set_color=bqm_color.style.backgroundColor;
                    sw.style.opacity=1;
                }, 40);
                monitor_elem.observe(sw, {attributes: true}); }}

        bqm_trance.addEventListener('input', function(event){
            event.preventDefault();
            let set_color_tmp=rgba(set_color, bqm_trance.value);
            let bqm_color=document.querySelector('#bqm_color');
            bqm_color.style.backgroundColor=set_color_tmp;
            if(card.classList.contains('edit_card')){
                let bqm=card.querySelector('.bqm');
                if(bqm){
                    bqm.style.color=set_color_tmp;
                    if(bq_set==4 || bq_set==5 || bq_set==6){
                        card.style.borderLeftColor=set_color_tmp; }}}});

    } // bgm_color()



    function bg_color(card){
        let set_color;
        let bq_color=document.querySelector('#bq_color');
        let bq_trance=document.querySelector('#bq_trance');
        let bq_bgc=card.style.backgroundColor;
        if(!bq_bgc){
            bq_bgc='rgb(255, 255, 255)'; }
        bq_color.style.backgroundColor=bq_bgc;
        bq_trance.value=rgba_trance(bq_bgc);
        set_color=bq_bgc;

        import_color(card, bq_color, "bq_bqc");

        let sw=bq_color;
        let monitor_elem=new MutationObserver(import_c);
        monitor_elem.observe(sw, {attributes: true});
        function import_c(){
            if(sw.style.opacity==2){
                monitor_elem.disconnect();
                setTimeout(()=>{
                    bq_trance.value=1;
                    set_color=bq_color.style.backgroundColor;
                    sw.style.opacity=1;
                }, 40);
                monitor_elem.observe(sw, {attributes: true}); }}


        bq_trance.addEventListener('input', function(event){
            event.preventDefault();
            let set_color_tmp=rgba(set_color, bq_trance.value);
            let bq_color=document.querySelector('#bq_color');
            bq_color.style.backgroundColor=set_color_tmp;
            if(card.classList.contains('edit_card')){
                card.style.backgroundColor=set_color_tmp; }});

    } // bg_color()



    function rgba(c_val, alpha){ // 透過色の白背景時の非透過色に変換
        let R, G, B;
        let c_val_arr=c_val.split(',');
        R=c_val_arr[0].replace(/[^0-9]/g, '');
        G=c_val_arr[1].replace(/[^0-9]/g, '');
        B=c_val_arr[2].replace(/[^0-9]/g, '');
        return 'rgb('+cpColor(R, alpha)+', '+cpColor(G, alpha)+', '+cpColor(B, alpha)+')'

        function cpColor(deci_code, alp){
            const colorCode=deci_code*alp + 255*(1 - alp);
            return Math.floor(colorCode).toString(10); }}



    function import_color(card, sw, type){
        let color_label;
        let icon_button;

        editor_iframe=document.querySelector('.cke_wysiwyg_frame');
        iframe_doc=editor_iframe.contentWindow.document;


        if(ua==0){
            color_label=document.querySelector('#cke_16_label');
            icon_button=document.querySelector('#cke_17'); }
        else if(ua==1){
            color_label=document.querySelector('#cke_15_label');
            icon_button=document.querySelector('#cke_16'); }

        let target_p=color_label;
        let monitor_p=new MutationObserver(get_copy);

        sw.onclick=function(event){
            if(card.classList.contains('edit_card')){
                icon_button.click();
                monitor_p.observe(target_p, {attributes: true}); }}


        function get_copy(){
            if(card.classList.contains('edit_card')){
                sw.style.backgroundColor=color_label.style.backgroundColor;
                if(type=="bq_bqc"){
                    card.style.backgroundColor=sw.style.backgroundColor; }
                else if(type=="bqm_c"){
                    let bqm=card.querySelector('.bqm');
                    if(bqm){
                        bqm.style.color=sw.style.backgroundColor;
                        if(bq_set==4 || bq_set==5 || bq_set==6){
                            card.style.borderLeftColor=sw.style.backgroundColor; }}}
                sw.style.opacity=2; }
            monitor_p.disconnect(); }


        document.addEventListener('mousedown', function(){
            monitor_p.disconnect(); });


        if(document.querySelector('.cke_wysiwyg_frame')!=null){
            editor_iframe=document.querySelector('.cke_wysiwyg_frame');
            if(editor_iframe){
                iframe_doc=editor_iframe.contentWindow.document;
                if(iframe_doc){
                    iframe_doc.addEventListener('mousedown', function(){
                        monitor_p.disconnect(); }); }}}


        let target_body=document.querySelector('.l-body');
        let monitor_generator=new MutationObserver(stealth);
        monitor_generator.observe(target_body, {childList: true, subtree: true});

        function stealth(){
            let color_generator=document.querySelector('.ck-l-colorGenerator');
            if(color_generator){
                color_generator.addEventListener('mousedown', function(event){
                    event.stopImmediatePropagation(); }); }}

    } // import_color()



    function rgba_trance(color_val){
        let trance_val;
        let c_val_arr=color_val.split(',');
        if(c_val_arr.length==3){
            trance_val=1; }
        else{
            trance_val=c_val_arr[3].replace(/[^0-9]/g, '')/10; }
        return trance_val; }



    function mem_plus(card){
        let bqmpl=document.querySelector('#bqmpl');
        if(bqmpl){
            bqmpl.onclick=function(){
                if(card.classList.contains('edit_card')){

                    let ok=confirm(
                        "　　 🟠 現在のBlockQuoteのデザインを登録します\n"+
                        "　　　　これまでの登録を上書きして良いですか？\n");

                    if(ok){

                        let bqm_c;
                        let bq_bgc;

                        let bqm=card.querySelector('.bqm'); // SVGマーク
                        if(!bqm){
                            bq_set=0;
                            bqm_c='rgb(255, 255, 255)'; }
                        else{
                            for(let k=0; k<10; k++){
                                if(bqm.classList.contains('m'+k)){
                                    bq_set=k;
                                    break; }}
                            if(bqm.style.color){
                                bqm_c=bqm.style.color; }
                            else{
                                bqm_c='rgb(255, 255, 255)'; }}
                        bqcard_set[0]=bq_set;
                        bqcard_set[1]=bqm_c;

                        bq_bgc=card.style.backgroundColor; // 引用部背景色
                        if(!bq_bgc){
                            bq_bgc='rgb(255, 255, 255)'; }
                        bqcard_set[2]=bq_bgc;

                        let write_json=JSON.stringify(bqcard_set);
                        localStorage.setItem('BQ_Style', write_json); // ストレージ保存
                    }}}}

    } // mem_plus()



    function mem_paste(card){
        let bqmps=document.querySelector('#bqmps');
        if(bqmps){
            bqmps.onclick=function(event){ // 引用部に「登録デザイン」を適用
                if(card.classList.contains('edit_card')){
                    let bqm_color=document.querySelector('#bqm_color');
                    let bqm_trance=document.querySelector('#bqm_trance');
                    let bq_color=document.querySelector('#bq_color');
                    let bq_trance=document.querySelector('#bq_trance');

                    if(bqm_color && bqm_trance){
                        bqm_color.style.backgroundColor=bqcard_set[1];
                        bqm_trance.value=1; }
                    add_style(card, bqcard_set[0]);
                    add_svg(card, bqcard_set[0]);

                    if(bq_color && bq_trance){
                        bq_color.style.backgroundColor=bqcard_set[2];
                        bq_trance.value=1; }
                    card.style.backgroundColor=bqcard_set[2];

                    bgm_color(card);
                    bg_color(card);
                }}

        }} // mem_paste()



    function sign(){
        monitor0.disconnect();

        let SVG_h=
            '<svg id="help_bq" viewBox="0 0 150 150">'+
            '<path  fill="#fff" d="M66 13C56 15 47 18 39 24C-12 60 18 146 82 137C92 '+
            '135 102 131 110 126C162 90 128 4 66 13M68 25C131 17 145 117 81 '+
            '125C16 133 3 34 68 25M69 40C61 41 39 58 58 61C66 63 73 47 82 57C84 '+
            '60 83 62 81 65C77 70 52 90 76 89C82 89 82 84 86 81C92 76 98 74 100 66'+
            'C105 48 84 37 69 40M70 94C58 99 66 118 78 112C90 107 82 89 70 94z">'+
            '</path></svg>';

        let SVG_bqz=
            '<svg id="bqz" style="width: 20px; height: 16px; fill: #333;" '+
            'viewbox="36 -20 440 440">'+
            '<path d="M365 103L365 258L337 230C328 221 320 212 306 218C301 '+
            '220 298 224 294 228C289 233 286 238 285 245C285 254 291 260 297 '+
            '266L329 298L368 337C375 344 381 352 391 352C404 352 412 342 421 '+
            '333L477 277C485 269 497 261 499 249C501 233 481 213 465 216C457 '+
            '218 451 227 445 233L419 259L419 110L419 75C419 68 419 61 415 '+
            '55C406 45 386 48 374 48L281 48C269 48 252 45 241 52C223 63 224 '+
            '91 244 101C251 104 259 103 266 103L304 103L365 103M100 147L100 '+
            '294L100 330C100 337 100 344 104 350C113 361 133 357 146 357L240 '+
            '357C253 357 270 360 281 353C298 342 296 317 279 307C270 303 261 '+
            '303 251 303L215 303L154 303L154 148L184 178C189 183 195 190 203 '+
            '190C212 190 218 184 224 178C229 173 233 169 234 162C235 153 228 '+
            '145 222 139L189 106L151 68C144 61 138 53 127 53C115 53 106 65 98 '+
            '73L42 129C34 137 22 145 20 157C18 172 37 192 53 190C62 188 68 179 '+
            '74 173L100 147z"></path></svg>';

        let SVG_bqmpl=
            '<svg id="bqmpl" viewBox="-45 -20 540 540">'+
            '<path fill="#333" d="M416 208H272V64c0-18-14-32-32-32h-32c-18 '+
            '0-32 14-32 32v144H32c-18 0-32 14-32 32v32c0 18 14 32 32 32h144v144c0 '+
            '18 14 32 32 32h32c18 0 32-14 32-32V304h144c18 0 32-14 '+
            '32-32v-32c0-18-14-32-32-32z"></path></svg>';

        let SVG_bqmps=
            '<svg id="bqmps" viewBox="0 -10 256 256">'+
            '<path style="fill:#fff" d="M0 0L0 256L256 256L256 0L0 0z"/>'+
            '<path style="fill:#333" d="M102 136L72 136C67 136 61 136 58 141C54 148 '+
            '59 153 63 158C72 169 82 180 91 191C100 201 109 212 118 222C122 226 '+
            '126 232 132 232C138 232 142 226 146 222C155 211 164 201 173 190C182 '+
            '179 192 169 201 158C205 153 210 148 207 142C203 136 198 136 192 '+
            '136L162 136C162 108 157 79 145 54C139 43 132 31 121 24C102 13 79 '+
            '13 58 17C53 18 39 20 38 27C37 31 49 29 51 29C67 27 85 32 96 45C102 53 '+
            '104 63 105 72C108 94 105 114 102 136z"/></svg>';


        let disp_bq=
            '<div id="disp_bq">'+ SVG_h +
            '<span class="bqs_hint hint"><b>▼</b> BlockQuote指定: Ctrl+Click</span>'+
            '<span class="bqz_hint hint">マーク: '+ SVG_bqz +'</span>　'+
            '<span class="bqc_hint hint">色: '+
            '<span class="bqc_w"><span id="bqm_color">　</span></span></span> '+
            '<input id="bqm_trance" type="number" max="10" min="0.1" step="0.1">'+
            ' :濃度　'+
            '<span class="bqc_hint hint">背景色: '+
            '<span class="bqc_w"><span id="bq_color">　</span></span></span> '+
            '<input id="bq_trance" type="number" max="10" min="0.1" step="0.1">'+
            ' :濃度　'+
            'M: <span class="bqmpl_hint hint">'+ SVG_bqmpl +'</span> '+
            '<span class="bqmp_hint hint">'+ SVG_bqmps +'</span>'+

            '<style>'+
            '#cke_1_contents { display: flex; flex-direction: column; } '+
            '#disp_bq { margin: 0 0 5px; padding: 4px 0 1px; white-space: nowrap; '+
            'font: normal 16px/24px Meiryo; color: #fff; background: #37474f; '+
            'user-select: none; } '+
            '#disp_bq .hint { position: relative; } '+
            '#disp_bq .hint:hover::after { position: absolute; z-index: 1; height: 23px; '+
            'padding: 1px 9px 0; font: 16px Meiryo; color: #fff; background: #000; } '+
            '#disp_bq .bqs_hint { margin: 0 20px 0 5px; } '+
            '#disp_bq .bqs_hint b { color: #a4fff7; } '+
            '#disp_bq .bqs_hint.hint:hover::after { top: 27px; left: -35px; '+
            'content: "　デザインを適用する本文中の引用部を「Ctrl+Click」で指定　"; } '+
            '#disp_bq .bqz_hint.hint:hover::after { top: 27px; left: -115px; '+
            'content: "　デザイン変更：Click ▲　"; } '+
            '#disp_bq .bqc_hint.hint:hover::after { top: 27px; right: -24px; '+
            'content: "　カラーパレット表示：Click ▲　"; } '+
            '#disp_bq .bqmpl_hint.hint:hover::after { top: 27px; left: -178px; '+
            'content: "　デザイン登録：Click ▲　"; } '+
            '#disp_bq .bqmp_hint.hint:hover::after { top: 27px; left: -226px; '+
            'content: "　登録デザインを適用：Click ▲ "; } '+

            '#disp_bq svg { cursor: pointer; width: 16px; height: 16px; padding: 1px; '+
            'border-radius: 2px; background: #fff; vertical-align: -3px; } '+
            '#disp_bq .bqc_w { display: inline-block; overflow: hidden; width: 16px; '+
            'height: 16px; border: 1px solid #fff; background: #fff; vertical-align: -3px; '+
            'margin-left: -2px; } '+
            '#bq_color, #bqm_color { cursor: pointer; background: #fff; } '+
            '#bq_trance, #bqm_trance { height: 21px; width: 15px; border: none; '+
            'vertical-align: 1px; background: #fff; margin-right: -2px; } '+
            '#bq_trance::-webkit-inner-spin-button, #bqm_trance::-webkit-inner-spin-button '+
            '{ opacity: 1; height: 18px; margin-top: 3px; } '+
            '#help_bq { background: #37474f !important; margin: 0 6px; cursor: pointer; }';

        if(ua==1){
            disp_bq +='#bq_trance { width: 18px; }'; }

        disp_bq +='</style></div>';


        editor_iframe=document.querySelector('.cke_wysiwyg_frame');
        if(editor_iframe){
            if(!document.querySelector('#disp_bq')){
                editor_iframe.insertAdjacentHTML('beforebegin', disp_bq); }

            iframe_doc=editor_iframe.contentWindow.document;
            if(iframe_doc){
                let iframe_html=iframe_doc.documentElement;
                if(iframe_html){
                    let style=
                        '<style id="bq_style">'+
                        '.edit_card { outline: 2px solid #2196f3; outline-offset: 6px; }'+
                        '</style>';
                    if(!iframe_html.querySelector('#bq_style')){
                        iframe_html.insertAdjacentHTML('beforeend', style); }}}}

        monitor0.observe(target0, {childList: true});

        document.querySelector('#disp_bq').style.display='block';
        let help=document.querySelector('#help_bq');

        help.onclick=function(){
            window.open("https://ameblo.jp/personwritep/entry-12768972860.html", '_blank'); }

    } // sign()



    function sign_clear(){
        if(target0.querySelector('#disp_bq')){
            target0.querySelector('#disp_bq').style.display='none'; }}



    function before_end(){
        editor_iframe=document.querySelector('.cke_wysiwyg_frame');
        let submitButton=document.querySelectorAll('.js-submitButton');
        submitButton[0].addEventListener("mousedown", all_close, false);
        submitButton[1].addEventListener("mousedown", all_close, false);

        function all_close(){
            if(mode==1){
                if(!editor_iframe){ // HTML表示の場合
                    alert("⛔　BQuote Sign が処理を終了していません\n\n"+
                          "　　 通常表示画面に戻り 編集を終了してください");
                    event.stopImmediatePropagation();
                    event.preventDefault(); }
                else if(editor_iframe){ // 通常表示の場合
                    mode=0;
                    card_close(); }}}
    } // before_end()


} // main()
