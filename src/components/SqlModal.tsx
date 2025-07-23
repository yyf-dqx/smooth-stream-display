import { AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface SqlModalProps {
  visible: boolean
  initialValues: any
  onClose: () => void
  onOk: (values: any) => Promise<void>
}

const SqlModal: React.FC<SqlModalProps> = ({
  visible,
  initialValues,
  onClose,
  onOk,
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [type, setType] = useState<string>('1')
  const [isTested, setIsTested] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    type: '1',
    name: '',
    host: '',
    port: '',
    schm: '',
    params: '',
    dbName: '',
    userName: '',
    password: '',
    remark: '',
  })

  useEffect(() => {
    if (visible && initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        type: initialValues.type?.toString() || '1',
        name: initialValues.name || '',
        host: initialValues.host || '',
        port: initialValues.port?.toString() || '',
        schm: initialValues.schm || '',
        params: initialValues.params || '',
        dbName: initialValues.dbName || '',
        userName: initialValues.userName || '',
        password: initialValues.password || '',
        remark: initialValues.remark || '',
      })
      setType(initialValues.type?.toString() || '1')
    } else if (!visible) {
      // 当 Modal 关闭时重置所有内容
      setFormData({
        type: '1',
        name: '',
        host: '',
        port: '',
        schm: '',
        params: '',
        dbName: '',
        userName: '',
        password: '',
        remark: '',
      })
      setType('1')
      setIsTested(false)
    }
  }, [visible, initialValues])

  const handleOk = async () => {
    setSaving(true)
    try {
      // 验证必填字段
      if (!formData.name || !formData.host || !formData.port || !formData.dbName || !formData.userName || !formData.password) {
        toast({
          title: "错误",
          description: "请填写所有必填字段",
          variant: "destructive",
        })
        return
      }

      if (type === '2' && !formData.schm) {
        toast({
          title: "错误", 
          description: "PostgreSQL 数据库需要填写 Schema",
          variant: "destructive",
        })
        return
      }

      const values = {
        ...formData,
        type: parseInt(formData.type),
        port: parseInt(formData.port),
      }

      await onOk(values) // 等待父组件的保存操作完成
      
      // 只有保存成功后才重置表单和类型
      setFormData({
        type: '1',
        name: '',
        host: '',
        port: '',
        schm: '',
        params: '',
        dbName: '',
        userName: '',
        password: '',
        remark: '',
      })
      setType('1')
      setIsTested(false)
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setSaving(false) // 无论成功还是失败都要关闭loading
    }
  }

  const handleSelectChange = (value: string) => {
    setType(value)
    setFormData(prev => ({ ...prev, type: value }))
    if (value === '1') {
      setFormData(prev => ({ ...prev, schm: '' }))
    }
  }

  const handleClose = () => {
    setFormData({
      type: '1',
      name: '',
      host: '',
      port: '',
      schm: '',
      params: '',
      dbName: '',
      userName: '',
      password: '',
      remark: '',
    })
    setType('1')
    setIsTested(false)
    onClose()
  }

  const handleTestConnection = async () => {
    setTesting(true)
    try {
      // 验证必填字段
      if (!formData.name || !formData.host || !formData.port || !formData.dbName || !formData.userName || !formData.password) {
        toast({
          title: "错误",
          description: "请填写所有必填字段",
          variant: "destructive",
        })
        return
      }

      // 模拟测试连接 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "成功",
        description: "连接成功",
      })
      setIsTested(true)
    } catch (error) {
      console.error('连接测试失败:', error)
      toast({
        title: "错误",
        description: "连接失败",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={visible} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>数据库配置</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div className="text-sm text-yellow-800">
            请确保您提供的账号为只读账号，否则有误操作风险！
          </div>
        </div>

        <form ref={formRef} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">数据库类型</Label>
            <div className="col-span-3">
              <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择数据库类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">MySQL</SelectItem>
                  <SelectItem value="2">PostgreSQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">数据源名 *</Label>
            <div className="col-span-3">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="请输入数据源名"
                maxLength={50}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="host" className="text-right">主机名称 *</Label>
            <div className="col-span-3">
              <Input
                id="host"
                value={formData.host}
                onChange={(e) => updateFormData('host', e.target.value)}
                placeholder="请输入主机名称"
                maxLength={50}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="port" className="text-right">端口 *</Label>
            <div className="col-span-3">
              <Input
                id="port"
                type="number"
                value={formData.port}
                onChange={(e) => updateFormData('port', e.target.value)}
                placeholder="请输入端口"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dbName" className="text-right">数据库名 *</Label>
            <div className="col-span-3">
              <Input
                id="dbName"
                value={formData.dbName}
                onChange={(e) => updateFormData('dbName', e.target.value)}
                placeholder="请输入数据库名"
                maxLength={50}
              />
            </div>
          </div>

          {type === '2' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schm" className="text-right">Schema *</Label>
              <div className="col-span-3">
                <Input
                  id="schm"
                  value={formData.schm}
                  onChange={(e) => updateFormData('schm', e.target.value)}
                  placeholder="请输入Schema"
                  maxLength={50}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="params" className="text-right">jdbc参数</Label>
            <div className="col-span-3">
              <Textarea
                id="params"
                value={formData.params}
                onChange={(e) => updateFormData('params', e.target.value)}
                placeholder="请输入jdbc参数,如：useUnicode=true"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userName" className="text-right">用户名 *</Label>
            <div className="col-span-3">
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => updateFormData('userName', e.target.value)}
                placeholder="请输入用户名"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">密码 *</Label>
            <div className="col-span-3">
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="请输入密码"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remark" className="text-right">备注</Label>
            <div className="col-span-3">
              <Textarea
                id="remark"
                value={formData.remark}
                onChange={(e) => updateFormData('remark', e.target.value)}
                placeholder="请输入备注"
              />
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testing || saving}
          >
            {testing ? "测试中..." : "测试连接"}
          </Button>
          <Button variant="outline" onClick={handleClose} disabled={saving}>
            取消
          </Button>
          <Button
            onClick={handleOk}
            disabled={!isTested || saving}
          >
            {saving ? "保存中..." : "保存"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SqlModal