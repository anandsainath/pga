<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class APIController extends Controller {

    public function actionGetPlayers() {
        echo CHtml::listBox('players', '1810', Player::model()->getPlayerList(), array(
            'id' => 'playerSelect', 'class' => 'js-select form-control'
        ));
    }

    public function actionGetData($id_player = 1810, $year = '2013') {
        $playerTournamentRecords = PlayerEventDetail::model()->getEventDetailsForPlayer($id_player, $year);
        $tournaments = array_map(function($obj) {
            return $obj->id_tournament;
        }, $playerTournamentRecords);

        $holeByHole = HoleDetail::model()->getDetailsForPlayerInTournaments($tournaments, $id_player);
        $playerRoundDetails = RoundDetail::model()->getRoundDetailsForPlayer($id_player, $year);
        $roundDetails = array_map(function(RoundDetail $obj) {
            return array(
                'par' => intval($obj->round_par),
                'score' => intval($obj->round_score),
                'fir' => intval($obj->fairways_hit),
                'gir' => intval($obj->greens_hit),
                'lr' => intval($obj->left_rough),
                'rr' => intval($obj->right_rough),
                'putt' => intval($obj->putts),
                'round' => intval($obj->round_number),
                'name' => $obj->Tournament->getName()
            );
        }, $playerRoundDetails);

        $tempHoleDetails = array_map(function(HoleDetail $obj) {
            $_array = array(
                'par' => intval($obj->par),
                'fir' => intval($obj->hit_fairway),
                'gir' => intval($obj->hit_green),
                'putts' => intval($obj->putts),
                'score' => intval($obj->score),
                'round' => intval($obj->round_number)
            );

            /*if($_array['fir'] == 0 && $obj->tee_shot_landing_location == 3){
                //if Tee shot lands at the Green, its taken as a FWY count..
                $_array['fir'] = 1;
            }*/
            
            if ($_array['fir'] == 0) {
                switch ($obj->tee_shot_landing_location_detail) {
                    case 7:
                    case 4:
                    case 1:
                        $_array['rough'] = "RR";
                        break;
                    case 8:
                    case 3:
                    case 5:
                        $_array['rough'] = "LR";
                        break;
                }
            }
            return $_array;
        }, $holeByHole);

        $holeDetails = array_chunk($tempHoleDetails, 18);
        $output_array = array();

        foreach ($playerTournamentRecords as $tournamentRecord) {
            $no_of_rounds = intval($tournamentRecord->total_rounds);

            if ($no_of_rounds == 0) {
                //remove the un-necessary round information..
                array_splice($roundDetails, 0, 1);
                continue;
            }

            $holeDetail = array_reverse(array_splice($holeDetails, 0, intval($tournamentRecord->total_rounds)));
            $roundDetail = array_reverse(array_splice($roundDetails, 0, intval($tournamentRecord->total_rounds)));

            $eventSummary = array();
            $totalPar = 0;
            $totalScore = 0;
            for ($index = 0; $index < 4; $index++) {
                $hole_detail = array_pop($holeDetail);
                $round_detail = array_pop($roundDetail);

                $totalPar += $round_detail['par'];
                $totalScore += $round_detail['score'];

                if (is_array($hole_detail)) {
                    $round_detail['gir'] = array_sum(
                            array_map(function($obj) {
                                return $obj['gir'];
                            }, $hole_detail)
                    );
                    $round_detail['fir'] = array_sum(
                            array_map(function($obj) {
                                return $obj['fir'];
                            }, $hole_detail)
                    );
                }

                $eventSummary[] = array(
                    'holeDetails' => $hole_detail,
                    'roundSummary' => $round_detail
                );
            }

            $output_array[] = array(
                'eventSummary' => $eventSummary,
                'information' => array(
                    'name' => $tournamentRecord->Tournament->getName(),
                    'place' => $tournamentRecord->Tournament->place,
                    'tournamentID' => intval($tournamentRecord->id_tournament),
                    'finishPosition' => intval($tournamentRecord->finish_position_numeric),
                    'finishPositionText' => $tournamentRecord->finish_position_text,
                    'totalScore' => intval($tournamentRecord->total_strokes),
                    'underPar' => $totalScore - $totalPar
                )
            );
        }
        echo CJSON::encode($output_array);
    }

}
