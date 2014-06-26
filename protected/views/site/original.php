
<div class="modal"></div>
<!-- Nav tabs -->
<ul class="nav nav-tabs nav-justified" id="golfTab">
    <li><a href="#score" data-toggle="tab">Score</a></li>
    <li><a href="#fir2" data-toggle="tab">FWY (2 colors)</a></li>
    <li><a href="#fir3" data-toggle="tab">FWY (3 colors)</a></li>
    <li><a href="#gir" data-toggle="tab">GIR</a></li>
    <li><a href="#putts" data-toggle="tab">Putts</a></li>
</ul>

<div class="btn-group btn-group-sm" style="margin-top: 10px; margin-left: 40%; display:block !important;">
    <button type="button" id="overall" class="btn btn-default js-btn">Overall Summary</button>
    <button type="button" id="hole-by-hole" class="btn btn-default js-btn">Hole by Hole</button>
</div>
<div id="checkboxes" style="margin-top: 15px; margin-left: 45%; display: none;">
    &nbsp;&nbsp;&nbsp;
    <input type="checkbox" id="par3" value="3" checked=checked/>
    <label for="par3">Par 3</label>
    &nbsp;&nbsp;&nbsp;
    <input type="checkbox" id="par4" value="4" checked=checked/>
    <label for="par4">Par 4</label>
    &nbsp;&nbsp;&nbsp;
    <input type="checkbox" id="par5" value="5" checked=checked/>
    <label for="par5">Par 5</label>
</div>
<!-- Tab panes -->
<div class="tab-content">
    <div class="tab-pane fade in active" id="score">
        <div id="score-overall" class="js-content-div">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1260" height="1000"></svg>
            <div id="overall_key" class="key">
                <ul style="list-style: none;"></ul>
            </div>
        </div>
        <div id="score-hole-by-hole" class="js-content-div">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1260" height="1000"></svg>
            <div id="hole-by-hole_key" class="key">
                <ul style="list-style: none;">
                    <li><span class="color-box" style="background: #D94801;"></span>Below Eagle</li>
                    <li><span class="color-box" style="background: #FDAE6B;"></span>Eagle</li>
                    <li><span class="color-box" style="background: #FEE6CE;"></span>Birdie</li>
                    <li><span class="color-box" style="background: #EFEFEF;"></span>Par</li>
                    <li><span class="color-box" style="background: #9ECAE1;"></span>Bogey</li>
                    <li><span class="color-box" style="background: #4292C6;"></span>Double Bogey</li>
                    <li><span class="color-box" style="background: #08519C;"></span>Above Double Bogey</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="fir2">
        <div id="fir2-overall" class="js-content-div">
            <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1260" height="1000"></svg>
            <div id="fir2-overall-key" class="key">
                <ul style="list-style: none;">

                </ul>
            </div>
        </div>
        <div id="fir2-hole-by-hole" class="js-content-div">
            <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1260" height="1000"></svg>
            <div id="fir2-hole-by-hole-key" class="key">
                <ul style="list-style: none;">
                    <li><span class="color-box" style="background: #C7E9C0;"></span>FWY Hit</li>
                    <li><span class="color-box" style="background: #FFF5EB;"></span>FWY Missed</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="fir3">
        <div id="fir3-overall" class="js-content-div">
            <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1260" height="1000"></svg>
            <div id="fir3-overall-key" class="key">
                <ul style="list-style: none;">

                </ul>
            </div>
        </div>
        <div id="fir3-hole-by-hole" class="js-content-div">
            <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1260" height="1000"></svg>
            <div id="fir3-hole-by-hole-key" class="key">
                <ul style="list-style: none;">
                    <li><span class="color-box" style="background: #fccebb;"></span>FWY Missed Left</li>
                    <li><span class="color-box" style="background: #f7f7f7;"></span>FWY Hit</li>
                    <li><span class="color-box" style="background: #d5e5f3;"></span>FWY Missed Right</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="gir">
        <div id="gir-overall" class="js-content-div">
            <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1260" height="1000"></svg>
            <div id="gir-overall-key" class="key">
                <ul style="list-style: none;">
                </ul>
            </div>
        </div>
        <div id="gir-hole-by-hole" class="js-content-div">
            <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1260" height="1000"></svg>
            <div id="gir-hole-by-hole-key" class="key">
                <ul style="list-style: none;">
                    <li><span class="color-box" style="background: #A1D99B;"></span>GIR</li>
                    <li><span class="color-box" style="background: #FFF5EB;"></span>No GIR</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="putts">
        <div id="putts-overall" class="js-content-div">
            <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1260" height="1000"></svg>
            <div id="putts-overall-key" class="key">
                <ul style="list-style: none;">
                </ul>
            </div>
        </div>
        <div id="putts-hole-by-hole" class="js-content-div">
            <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1260" height="1000"></svg>
            <div id="putts-hole-by-hole-key" class="key">
                <ul style="list-style: none;">
                    <li><span class="color-box" style="background: #FDAE6B;"></span>0 putts</li>
                    <li><span class="color-box" style="background: #FEE6CE;"></span>1 putt</li>
                    <li><span class="color-box" style="background: #FFF5EB;"></span>2 putts</li>
                    <li><span class="color-box" style="background: #9ECAE1;"></span>3 putts</li>
                    <li><span class="color-box" style="background: #08519C;"></span>4+ putts</li>
                </ul>
            </div>
        </div>
    </div>
</div>

