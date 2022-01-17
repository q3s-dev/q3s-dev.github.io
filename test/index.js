import './emulateDOM.js'
// @ts-ignore
import { Test } from '@nodutilus/test'
import { Tq3sCoreData } from './@q3s_core_data.js'


/** Общий тестовый класс */
class TestQ3S extends Test {

  static ['module: @q3s/core/data'] = Tq3sCoreData

}


Test.runOnCI(new TestQ3S())
