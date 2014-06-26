<?php

/**
 * This is the model class for table "tbl_course".
 *
 * The followings are the available columns in table 'tbl_course':
 * @property string $id_course
 * @property string $name
 * @property integer $total_par
 * @property integer $total_yardage
 *
 * The followings are the available model relations:
 * @property HoleDetail[] $holeDetails
 */
class Course extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'tbl_course';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('name, total_par, total_yardage', 'required'),
			array('total_par, total_yardage', 'numerical', 'integerOnly'=>true),
			array('name', 'length', 'max'=>63),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id_course, name, total_par, total_yardage', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'holeDetails' => array(self::HAS_MANY, 'HoleDetail', 'id_course'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id_course' => 'Id Course',
			'name' => 'Name',
			'total_par' => 'Total Par',
			'total_yardage' => 'Total Yardage',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id_course',$this->id_course,true);
		$criteria->compare('name',$this->name,true);
		$criteria->compare('total_par',$this->total_par);
		$criteria->compare('total_yardage',$this->total_yardage);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Course the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
