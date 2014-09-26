<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class ProcessController extends Controller {

    public function actionRound($input_file = 'data/2012/round.csv') {
        $row = 1;
        set_time_limit(0);

        $TOURNAMENT_YEAR_INDEX = 1;
        $PERMANENT_TOURNAMENT_NUMBER_INDEX = 3;
        $PLAYER_NUMBER_INDEX = 7;
        $ROUND_INDEX = 9;
        $ROUND_PAR_INDEX = 12;
        $ROUND_SCORE_INDEX = 15;

        $EAGLES_INDEX = 21;
        $EAGLES_RANK_INDEX = 22;
        $BIRDIES_INDEX = 23;
        $BIRDIES_RANK_INDEX = 24;
        $PARS_INDEX = 25;
        $BOGEYS_INDEX = 26;
        $BOGEYS_RANK_INDEX = 27;
        $DOUBLES_INDEX = 28;
        $OTHERS_INDEX = 29;

        $LEFT_ROUGH_INDEX = 44;
        $RIGHT_ROUGH_INDEX = 45;

        $GIR_INDEX = 79;
        $FIR_INDEX = 84;
        $PUTTS_INDEX = 122;
        $PUTTS_GAINED_INDEX = 172;

        if (($handle = fopen($input_file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 0, ";")) !== FALSE) {
                if (1 == $row) {
                    //var_dump($data);
                    $row++;
                    continue;
                }

                $permanent_tournament_number = intval($data[$PERMANENT_TOURNAMENT_NUMBER_INDEX]);
                $tournament_year = $data[$TOURNAMENT_YEAR_INDEX];
                $tournament = Tournament::model()->findByAttributes(array(
                    'permanent_tournament_number' => $permanent_tournament_number,
                    'year' => $tournament_year
                ));

                $record = new RoundDetail();
                $record->id_tournament = $tournament->id_tournament;
                $record->id_player = intval($data[$PLAYER_NUMBER_INDEX]);
                $record->round_par = intval($data[$ROUND_PAR_INDEX]);
                $record->round_score = intval($data[$ROUND_SCORE_INDEX]);
                $record->eagles = intval($data[$EAGLES_INDEX]);
                $record->eagles_rank = intval($data[$EAGLES_RANK_INDEX]);
                $record->birdies = intval($data[$BIRDIES_INDEX]);
                $record->birdies_rank = intval($data[$BIRDIES_RANK_INDEX]);
                $record->pars = intval($data[$PARS_INDEX]);
                $record->bogeys = intval($data[$BOGEYS_INDEX]);
                $record->bogeys_rank = intval($data[$BOGEYS_RANK_INDEX]);
                $record->doubles = intval($data[$DOUBLES_INDEX]);
                $record->others = intval($data[$OTHERS_INDEX]);
                $record->left_rough = intval($data[$LEFT_ROUGH_INDEX]);
                $record->right_rough = intval($data[$RIGHT_ROUGH_INDEX]);
                $record->round_number = intval($data[$ROUND_INDEX]);
                $record->putts = intval($data[$PUTTS_INDEX]);
                $record->fairways_hit = intval($data[$FIR_INDEX]);
                $record->greens_hit = intval($data[$GIR_INDEX]);

                $putts_gained_str = $data[$PUTTS_GAINED_INDEX];
                $putts_gained = floatval($putts_gained_str);
                if (strpos($putts_gained_str, "-")) {
                    $putts_gained = -$putts_gained;
                }
                $record->putts_gained = $putts_gained;

                if ($record->validate()) {
                    try {
                        $record->save();
                    } catch (Exception $ex) {
                        if ($ex->getCode() != DUPLICATE_CODE) {
                            var_dump("Insertion error", $ex->getMessage());
                        }
                    }
                } else {
                    var_dump("Validation error", $record->getErrors(), $record->attributes);
                }
                //break;
            }
        }
    }

    public function actionEvent($input_file = 'data/2012/event.csv') {
        $row = 1;
        set_time_limit(0);

        $TOURNAMENT_YEAR_INDEX = 1;
        $PERMANENT_TOURNAMENT_NUMBER_INDEX = 3;
        $PLAYER_NUMBER_INDEX = 6;
        $TOTAL_STROKES_INDEX = 28;
        $TOTAL_ROUNDS_INDEX = 29;
        $FINISH_POSN_NUMERIC_INDEX = 13;
        $FINISH_POSN_TEXT_INDEX = 14;

        $FEDEX_POINTS_INDEX = 11;
        $MONEY_INDEX = 12;

        $EAGLES_INDEX = 33;
        $EAGLES_RANK_INDEX = 34;
        $BIRDIES_INDEX = 35;
        $BIRDIES_RANK_INDEX = 36;
        $PARS_INDEX = 37;
        $BOGEYS_INDEX = 38;
        $BOGEYS_RANK_INDEX = 39;
        $DOUBLES_INDEX = 40;
        $OTHERS_INDEX = 41;
        $HOLES_OVER_PAR_INDEX = 42;
        $BOGEY_AVOIDANCE_RANK_INDEX = 43;
        $GREENS_HIT_INDEX = 45;

        $ROUND_1_SCORE_INDEX = 15;
        $ROUND_1_POSITION_INDEX = 16;
        $ROUND_2_SCORE_INDEX = 17;
        $ROUND_2_POSITION_INDEX = 18;
        $ROUND_3_SCORE_INDEX = 19;
        $ROUND_3_POSITION_INDEX = 20;
        $ROUND_4_SCORE_INDEX = 21;
        $ROUND_4_POSITION_INDEX = 22;
        $ROUND_5_SCORE_INDEX = 23;
        $ROUND_5_POSITION_INDEX = 24;
        $ROUND_6_SCORE_INDEX = 25;
        $ROUND_6_POSITION_INDEX = 26;
        $LOWERST_POSITION_INDEX = 27;

        if (($handle = fopen($input_file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 0, ";")) !== FALSE) {
                if (1 == $row) {
//var_dump($data);
                    $row++;
                    continue;
                }

                $permanent_tournament_number = intval($data[$PERMANENT_TOURNAMENT_NUMBER_INDEX]);
                $tournament_year = $data[$TOURNAMENT_YEAR_INDEX];
                $tournament = Tournament::model()->findByAttributes(array(
                    'permanent_tournament_number' => $permanent_tournament_number,
                    'year' => $tournament_year
                ));

                $record = new PlayerEventDetail();
                $record->id_tournament = $tournament->id_tournament;
                $record->id_player = intval($data[$PLAYER_NUMBER_INDEX]);
                $record->total_strokes = intval($data[$TOTAL_STROKES_INDEX]);
                $record->total_rounds = intval($data[$TOTAL_ROUNDS_INDEX]);
                $record->finish_position_numeric = intval($data[$FINISH_POSN_NUMERIC_INDEX]);
                $record->finish_position_text = trim($data[$FINISH_POSN_TEXT_INDEX]);
                $record->fedex_points = floatval(str_replace(",", "", $data[$FEDEX_POINTS_INDEX]));
                $record->money = floatval(str_replace(",", "", $data[$MONEY_INDEX]));
                $record->eagles = intval($data[$EAGLES_INDEX]);
                $record->eagles_rank = intval($data[$EAGLES_RANK_INDEX]);
                $record->birdies = intval($data[$BIRDIES_INDEX]);
                $record->birdies_rank = intval($data[$BIRDIES_RANK_INDEX]);
                $record->pars = intval($data[$PARS_INDEX]);
                $record->bogeys = intval($data[$BOGEYS_INDEX]);
                $record->bogeys_rank = intval($data[$BOGEYS_RANK_INDEX]);
                $record->doubles = intval($data[$DOUBLES_INDEX]);
                $record->other = intval($data[$OTHERS_INDEX]);
                $record->holes_over_par = intval($data[$HOLES_OVER_PAR_INDEX]);
                $record->bogey_avoidance_rank = intval($data[$BOGEY_AVOIDANCE_RANK_INDEX]);
                $record->greens_hit = intval($data[$GREENS_HIT_INDEX]);

                if ($record->validate()) {
                    try {
                        $record->save();

                        $roundDetail = new PlayerEventRoundDetail();
                        $roundDetail->id_player_event_detail = $record->id_player_event_detail;
                        $roundDetail->round_1_position = intval($data[$ROUND_1_POSITION_INDEX]);
                        $roundDetail->round_1_score = intval($data[$ROUND_1_SCORE_INDEX]);
                        $roundDetail->round_2_position = intval($data[$ROUND_2_POSITION_INDEX]);
                        $roundDetail->round_2_score = intval($data[$ROUND_2_SCORE_INDEX]);
                        $roundDetail->round_3_position = intval($data[$ROUND_3_POSITION_INDEX]);
                        $roundDetail->round_3_score = intval($data[$ROUND_3_SCORE_INDEX]);
                        $roundDetail->round_4_position = intval($data[$ROUND_4_POSITION_INDEX]);
                        $roundDetail->round_4_score = intval($data[$ROUND_4_SCORE_INDEX]);
                        $roundDetail->round_5_position = intval($data[$ROUND_5_POSITION_INDEX]);
                        $roundDetail->round_5_score = intval($data[$ROUND_5_SCORE_INDEX]);
                        $roundDetail->round_6_position = intval($data[$ROUND_6_POSITION_INDEX]);
                        $roundDetail->round_6_score = intval($data[$ROUND_6_SCORE_INDEX]);
                        $roundDetail->lowest_round = intval($data[$LOWERST_POSITION_INDEX]);

                        if ($roundDetail->validate()) {
                            try {
                                $roundDetail->save();
                            } catch (Exception $ex) {
                                if ($ex->getCode() != DUPLICATE_CODE) {
                                    var_dump("Insertion Error", $roundDetail->attributes, $data);
                                }
                            }
                        } else {
                            var_dump("Error", $roundDetail->getErrors());
                        }
                    } catch (Exception $ex) {
                        if ($ex->getCode() != DUPLICATE_CODE) {
                            var_dump("Insertion error ->", $record->attributes, $data);
                        }
                    }
                } else {
                    var_dump("Errors", $record->getErrors());
                }
//break;
            }
        }
    }

    public function actionHole($input_file = 'data/2012/hole.csv') {
        $row = 1;
        set_time_limit(0);
        $TOURNAMENT_YEAR_INDEX = 1;
        $PERMANENT_TOURNAMENT_NUMBER_INDEX = 3;
        $PLAYER_NUMBER_INDEX = 4;
        $HOLE_NUMBER_INDEX = 7;
        $ROUND_NUMBER_INDEX = 8;
        $FINAL_ROUND_INDEX = 9;
        $PAR_INDEX = 12;
        $SCORE_YARDAGE = 13;
        $ACTUAL_YARDAGE = 14;
        $SCORE_INDEX = 15;
        $RTP_SCORE_INDEX = 16;
        $HIT_FWY_INDEX = 17;
        $HIT_GREEN_INDEX = 18;
        $HIT_GREENSIDE_BUNKER_INDEX = 19;
        $SAND_SAVE_INDEX = 20;
        $SCRAMBLING_SUCCESS_INDEX = 21;
        $PUTTS_INDEX = 22;
        $DRIVING_DISTANCE_INDEX = 23;
        $TEE_SHOT_LANDING_INDEX = 24;
        $TEE_SHOT_DETAILED_LANDING_INDEX = 25;
        $APP_SHOT_DIST_TO_PIN = 26;
        $APP_SHOT_PROX_TO_HOLE = 27;
        $APP_SHOT_LANDING_INDEX = 28;
        $APP_SHOT_DETAILED_LANDING_INDEX = 29;
        $MADE_PUTT_DISTANCE_INDEX = 30;
        $GOING_FOR_IT_INDEX = 31;
        $WENT_FOR_IT_INDEX = 32;
        $GFG_HIT_GREEN_INDEX = 33;
        $GFG_DISTANCE_TO_PIN_INDEX = 34;
        $GFG_PROX_TO_HOLE_INDEX = 35;
        $DRIVING_DISTANCE_MEASURED_INDEX = 36;
        $MEASURED_DRIVING_DIST_INDEX = 37;
        $APP_SHOT_ENDED_ON_OR_ARG_INDEX = 38;
        $APP_SHOT_START_LOCATION_INDEX = 39;
        $APP_SHOT_START_DETAILED_LANDING_INDEX = 40;
        $GFG_SHOT_START_LOCATION_INDEX = 41;
        $GFG_SHOT_START_DETAILED_LOCATION_INDEX = 42;

        $HOLE_SEQUENCE_NUMBER_INDEX = 43;
        $SCRAMBLING_SHOT_STARTING_LOCATION_INDEX = 44;
        $SCRAMBLING_SHOT_START_DETAILED_LOCATION_INDEX = 45;
        $SCRAMBLING_SHOT_DISTANCE_TO_HOLE = 46;
        $SCRAMBLING_SHOT_PROX_TO_HOLE = 47;

        $TIME_FINISHED_INDEX = 48;
        $PUTTS_GAINED_INDEX = 49;

        if (($handle = fopen($input_file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 0, ";")) !== FALSE) {
                if (1 == $row) {
                    //var_dump($data);
                    $row++;
                    continue;
                }
                
                $permanent_tournament_number = intval($data[$PERMANENT_TOURNAMENT_NUMBER_INDEX]);
                $tournament_year = $data[$TOURNAMENT_YEAR_INDEX];
                $tournament = Tournament::model()->findByAttributes(array(
                    'permanent_tournament_number' => $permanent_tournament_number,
                    'year' => $tournament_year
                ));

                $hole = new HoleDetail();
                $hole->id_tournament = intval($tournament->id_tournament);
                $hole->id_player = intval($data[$PLAYER_NUMBER_INDEX]);
                $hole->round_number = intval($data[$ROUND_NUMBER_INDEX]);
                $hole->hole_number = intval($data[$HOLE_NUMBER_INDEX]);
                $hole->final_round = intval($data[$FINAL_ROUND_INDEX]);
                $hole->par = intval($data[$PAR_INDEX]);
                $hole->scorecard_yardage = intval($data[$SCORE_YARDAGE]);
                $hole->actual_yardage = intval($data[$ACTUAL_YARDAGE]);
                $hole->score = intval($data[$SCORE_INDEX]);
                $hole->rtp_score = intval($data[$RTP_SCORE_INDEX]);
                $hole->hit_fairway = intval($data[$HIT_FWY_INDEX]);
                $hole->hit_green = intval($data[$HIT_GREEN_INDEX]);
                $hole->hit_greenside_bunker = intval($data[$HIT_GREENSIDE_BUNKER_INDEX]);
                $hole->sand_save = intval($data[$SAND_SAVE_INDEX]);
                $hole->scrambling_success = intval($data[$SCRAMBLING_SUCCESS_INDEX]);
                $hole->putts = intval($data[$PUTTS_INDEX]);
                $hole->driving_distance = intval($data[$DRIVING_DISTANCE_INDEX]);
                $hole->tee_shot_landing_location = LandingLocation::model()->getLocationID($data[$TEE_SHOT_LANDING_INDEX]);
                $hole->tee_shot_landing_location_detail = LandingLocationDetail::model()->getLocationID($data[$TEE_SHOT_DETAILED_LANDING_INDEX]);
                $hole->approach_shot_distance_to_pin = intval($data[$APP_SHOT_DIST_TO_PIN]);
                $hole->approach_shot_proximity_to_hole = intval($data[$APP_SHOT_PROX_TO_HOLE]);
                $hole->approach_shot_landing_location = LandingLocation::model()->getLocationID($data[$APP_SHOT_LANDING_INDEX]);
                $hole->approach_shot_landing_location_detail = LandingLocationDetail::model()->getLocationID($data[$APP_SHOT_DETAILED_LANDING_INDEX]);
                $hole->made_putt_distance = intval($data[$MADE_PUTT_DISTANCE_INDEX]);
                $hole->going_for_it_hole = intval($data[$GOING_FOR_IT_INDEX]);
                $hole->went_for_it_hole = intval($data[$WENT_FOR_IT_INDEX]);
                $hole->going_for_it_hit_green = intval($data[$GFG_HIT_GREEN_INDEX]);
                $hole->going_for_it_shot_distance_to_pin = intval($data[$GFG_DISTANCE_TO_PIN_INDEX]);
                $hole->going_for_it_shot_proximity_to_hole = intval($data[$GFG_PROX_TO_HOLE_INDEX]);
                $hole->driving_distance_measured = ($data[$DRIVING_DISTANCE_MEASURED_INDEX] == "Y") ? 1 : 0;
                $hole->measured_driving_distance = intval($data[$MEASURED_DRIVING_DIST_INDEX]);
                $hole->approach_shot_ended_on_or_around_green = ($data[$APP_SHOT_ENDED_ON_OR_ARG_INDEX] == "Y") ? 1 : 0;
                $hole->approach_shot_starting_location = LandingLocation::model()->getLocationID($data[$APP_SHOT_START_LOCATION_INDEX]);
                $hole->approach_shot_starting_location_detail = LandingLocationDetail::model()->getLocationID($data[$APP_SHOT_START_DETAILED_LANDING_INDEX]);
                $hole->going_for_it_shot_starting_location = LandingLocation::model()->getLocationID($data[$GFG_SHOT_START_LOCATION_INDEX]);
                $hole->going_for_it_shot_starting_location_detail = LandingLocationDetail::model()->getLocationID($data[$GFG_SHOT_START_DETAILED_LOCATION_INDEX]);
                $hole->hole_sequence_number = intval($data[$HOLE_SEQUENCE_NUMBER_INDEX]);
                $hole->scrambling_shot_start_location = LandingLocation::model()->getLocationID($data[$SCRAMBLING_SHOT_STARTING_LOCATION_INDEX]);
                $hole->scrambling_shot_start_location_detail = LandingLocationDetail::model()->getLocationID($data[$SCRAMBLING_SHOT_START_DETAILED_LOCATION_INDEX]);
                $hole->scrambling_shot_distance_to_hole = intval($data[$SCRAMBLING_SHOT_DISTANCE_TO_HOLE]);
                $hole->scrambling_shot_proximity_to_hole = intval($data[$SCRAMBLING_SHOT_PROX_TO_HOLE]);
                $hole->time_hole_finished = $data[$TIME_FINISHED_INDEX];
                $hole->putts_gained = floatval($data[$PUTTS_GAINED_INDEX]);


                if ($hole->validate()) {
                    try {
                        $hole->save();
                    } catch (Exception $ex) {
                        var_dump($ex);
                        if ($ex->getCode() != DUPLICATE_CODE) {
                            var_dump("Insertion Error", $hole->attributes);
                        }
                    }
                } else {
                    var_dump($hole->getErrors());
                }
                //break;
            }
        }
    }

    public function actionLocation($input_file = 'data/2012/shot.csv') {
        $row = 1;
        $SHORT_LOCATION_1_INDEX = 19;
        $SHORT_LOCATION_2_INDEX = 21;
        $SHORT_DETAILED_LOCATION_1_INDEX = 20;
        $SHORT_DETAILED_LOCATION_2_INDEX = 22;

        if (($handle = fopen($input_file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 0, ";")) !== FALSE) {
                if (1 == $row) {
                    $row++;
                    continue;
                }

                $location_array = array(
                    trim($data[$SHORT_LOCATION_1_INDEX]),
                    trim($data[$SHORT_LOCATION_2_INDEX])
                );

                $detailed_location_array = array(
                    trim($data[$SHORT_DETAILED_LOCATION_1_INDEX]),
                    trim($data[$SHORT_DETAILED_LOCATION_2_INDEX])
                );

                $this->processLocation($location_array);
                $this->processDetailedLocation($detailed_location_array);

                $row++;
            }
        }
    }

    private function processLocation($location_array) {
        foreach ($location_array as $location) {
            $location = trim($location);
            if (strlen($location) > 0 && intval(LandingLocation::model()->countByAttributes(array('description' => $location))) == 0) {
                $record = new LandingLocation();
                $record->description = $location;
                if ($record->validate()) {
                    try {
                        $record->save();
                    } catch (Exception $ex) {
                        
                    }
                }
            }
        }
    }

    private function processDetailedLocation($location_array) {
        foreach ($location_array as $location) {
            $location = trim($location);
            if (strlen($location) > 0 && intval(LandingLocationDetail::model()->countByAttributes(array('description' => $location))) == 0) {
                $record = new LandingLocationDetail();
                $record->description = $location;
                if ($record->validate()) {
                    try {
                        $record->save();
                    } catch (Exception $ex) {
                        
                    }
                }
            }
        }
    }

    public function actionPlayer($input_file = 'data/2012/event.csv') {
        $row = 1;
        $PLAYER_NUMBER_INDEX = 6;
        $PLAYER_NAME_INDEX = 7;
        $PLAYER_AGE_INDEX = 8;

        if (($handle = fopen($input_file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 0, ";")) !== FALSE) {
                if (1 == $row) {
                    $row++;
                    continue;
                }

                $name = $data[$PLAYER_NAME_INDEX];
                $player_number = intval($data[$PLAYER_NUMBER_INDEX]);

                if (intval(Player::model()->countByAttributes(array('id_player' => $player_number))) == 0) {
                    $record = new Player();
                    $record->id_player = $player_number;
                    $record->last_name = trim(substr($name, 0, strrpos($name, ",")));
                    $record->first_name = trim(substr($name, strrpos($name, ",") + 1));

                    $age_str = $data[$PLAYER_AGE_INDEX];
                    if (strlen(trim($age_str)) != 0) {
                        $temp = explode(" ", $age_str);
                        $dob = new DateTime('2014-02-11');
                        $dob->modify("-$temp[0] years");
                        $dob->modify("-$temp[1] months");
                        $dob->modify("-$temp[2] days");
                        $record->dob = $dob->format('Y-m-d');
                    }


                    if ($record->validate()) {
                        try {
                            $record->save();
                        } catch (Exception $e) {
                            if ($e->getCode() != DUPLICATE_CODE) {
                                var_dump("Insertion error", $record->attributes);
                            }
                        }
                    }
                }
                $row++;
            }
        }
    }

    public function actionTournament($input_file = 'data/2012/event.csv') {
        $row = 1;

        $TOURNAMENT_CODE_INDEX = 0;
        $TOURNAMENT_NAME_INDEX = 9;
        $TOURNAMENT_YEAR_INDEX = 1;
        $TOURNAMENT_NUMBER_INDEX = 2;
        $PERMANENT_TOURNAMENT_NUMBER_INDEX = 3;
        $OFFICIAL_EVENT_INDEX = 10;

        if (($handle = fopen($input_file, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 0, ";")) !== FALSE) {
                if (1 == $row) {
                    $row++;
                    continue;
                }

                $name = $data[$TOURNAMENT_NAME_INDEX];
                $year = $data[$TOURNAMENT_YEAR_INDEX];

                if (intval(Tournament::model()->countByAttributes(array('name' => $name, 'year' => $year))) == 0) {
                    $tournament = new Tournament();
                    $tournament->id_tournament_code = intval(TournamentCode::model()->findByAttributes(array('short_code' => $data[$TOURNAMENT_CODE_INDEX]))->id_tournament_code);
                    $tournament->name = $name;
                    $tournament->year = $year;
                    $tournament->tournament_number = intval($data[$TOURNAMENT_NUMBER_INDEX]);
                    $tournament->permanent_tournament_number = intval($data[$PERMANENT_TOURNAMENT_NUMBER_INDEX]);
                    $tournament->official_event = (trim($data[$OFFICIAL_EVENT_INDEX]) == "Y") ? 1 : 0;

                    if ($tournament->validate()) {
                        try {
                            $tournament->save();
                        } catch (Exception $e) {
                            if ($e->getCode() != DUPLICATE_CODE) {
                                var_dump("Insertion error", $tournament->attributes);
                            }
                        }
                    }
                }
                $row++;
            }
        }
    }

}
